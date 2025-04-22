import axios from 'axios';
import { is_authenticated, refresh_token } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

// Helper function to get auth header with token refresh
const getAuthHeader = async () => {
  let token = localStorage.getItem('accessToken');
  console.log("this is token", token);
  
  if (!token) {
    throw new Error('No access token found');
  }

  try {
    // Try current token
    const response = await axios.get(`${API_URL}/auth-app/api/authenticated/`, {
      headers: { Authorization: `Bearer ${token}` }
      
    });
    console.log("this is response", response);

  return {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  } catch (error) {
    console.log("this is error", error);
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token found');

      try {
        const refreshResponse = await axios.post(`${API_URL}/auth-app/api/token/refresh/`, {
          refresh: refreshToken
        });

        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem('accessToken', newAccessToken);

        return {
          headers: { 
            Authorization: `Bearer ${newAccessToken}`,
            'Content-Type': 'application/json'
          }
        };
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
    }
    throw error;
  }
};

class ChatService {
  constructor() {
    this.ws = null;
    this.token = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = null;
    this.messageQueue = [];
    this.connectionState = 'DISCONNECTED';
    this.messageHandlers = new Set();
    this.errorHandlers = new Set();
    this.connectionHandlers = new Set();
    this.currentUserId = null;
    this.receiverId = null;
    this.heartbeatInterval = null;
    this.lastHeartbeat = null;
    this.HEARTBEAT_TIMEOUT = 30000; // 30 seconds
  }

  async initialize() {
    try {
      const config = await getAuthHeader();
      const token = config.headers.Authorization.split(' ')[1];
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user?.id) {
        this.handleError(new Error('No authentication token or user ID available'));
        return;
      }

      this.token = token;
      this.currentUserId = user.id;
      this.connectWebSocket();
    } catch (error) {
      this.handleError(new Error('Failed to initialize ChatService: ' + error.message));
    }
  }

  // Event handler registration
  onMessage(handler) { this.messageHandlers.add(handler); }
  onError(handler) { this.errorHandlers.add(handler); }
  onConnectionChange(handler) { this.connectionHandlers.add(handler); }
  removeMessageHandler(handler) { this.messageHandlers.delete(handler); }
  removeErrorHandler(handler) { this.errorHandlers.delete(handler); }
  removeConnectionHandler(handler) { this.connectionHandlers.delete(handler); }

  connectWebSocket() {
    try {
      if (!this.token || !this.currentUserId || !this.receiverId) {
        this.handleError(new Error('Missing required connection parameters'));
        return;
      }

      if (this.ws && 
          (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
        console.log('WebSocket is already connected or connecting');
        return;
      }

      // Format room name as expected by backend
      const roomName = `${Math.min(this.currentUserId, this.receiverId)}_${Math.max(this.currentUserId, this.receiverId)}`;
      const wsUrl = `${WS_URL}/ws/chat/${roomName}/?token=${this.token}`;
      console.log('Connecting to WebSocket:', wsUrl);

      this.ws = new WebSocket(wsUrl);
      this.connectionState = 'CONNECTING';
      this.notifyConnectionChange();

      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.connectionState = 'CONNECTED';
        this.reconnectAttempts = 0;
        this.notifyConnectionChange();
        this.processMessageQueue();
        this.startHeartbeat();
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        this.connectionState = 'DISCONNECTED';
        this.notifyConnectionChange();
        this.stopHeartbeat();
        
        // Handle specific close codes
        switch (event.code) {
          case 4001:
            this.handleError(new Error('Authentication failed. Please login again.'));
            break;
          case 4002:
            this.handleError(new Error('Invalid chat room configuration.'));
            break;
          case 1006:
            this.handleReconnect(event);
            break;
          default:
            if (event.code !== 1000) { // Don't reconnect on normal closure
              this.handleReconnect(event);
            }
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Don't set error state for connection errors, let onclose handle reconnection
        if (this.connectionState === 'CONNECTED') {
          this.handleError(new Error('WebSocket connection error'));
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data);
          
          // Handle heartbeat messages
          if (data.type === 'heartbeat') {
            this.lastHeartbeat = Date.now();
            this.ws.send(JSON.stringify({
              type: 'heartbeat_response',
              timestamp: data.timestamp
            }));
            return;
          }
          
          if (data.error) {
            this.handleError(new Error(data.error));
          } else {
            this.messageHandlers.forEach(handler => handler(data));
          }
        } catch (error) {
          console.error('Failed to parse message:', error);
          this.handleError(new Error('Failed to parse message'));
        }
      };

    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleError(error);
    }
  }

  startHeartbeat() {
    this.stopHeartbeat(); // Clear any existing interval
    this.lastHeartbeat = Date.now();
    
    this.heartbeatInterval = setInterval(() => {
      if (this.connectionState === 'CONNECTED' && this.ws?.readyState === WebSocket.OPEN) {
        const now = Date.now();
        if (now - this.lastHeartbeat > this.HEARTBEAT_TIMEOUT) {
          console.log('Heartbeat timeout, reconnecting...');
          this.ws.close(1006); // Abnormal closure
        }
      }
    }, 10000); // Check every 10 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  handleReconnect(event) {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.handleError(new Error('Maximum reconnection attempts reached. Please refresh the page.'));
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    this.reconnectTimeout = setTimeout(() => {
      if (this.connectionState !== 'CONNECTED') {
        this.connectWebSocket();
      }
    }, delay);
  }

  validateMessage(message) {
    if (!message || typeof message !== 'object') throw new Error('Invalid message format');
    if (!message.message) throw new Error('Message content is required');
    if (!message.receiver) throw new Error('Receiver ID is required');
    if (message.message.length > 5000) throw new Error('Message content too long');
    return true;
  }

  async safeSend(message) {
    try {
      this.validateMessage(message);

      if (this.connectionState !== 'CONNECTED') {
        console.log('Connection not ready, queuing message');
        this.messageQueue.push(message);
        return false;
      }

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const formattedMessage = {
          type: 'chat_message',
          message: message.message,
          receiver: message.receiver
        };
        this.ws.send(JSON.stringify(formattedMessage));
        return true;
        } else {
        this.messageQueue.push(message);
        return false;
      }
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

  async processMessageQueue() {
    while (this.messageQueue.length > 0 && this.connectionState === 'CONNECTED') {
      const message = this.messageQueue.shift();
      await this.safeSend(message);
    }
  }

  async safeClose() {
    try {
      if (this.ws) {
        this.connectionState = 'DISCONNECTING';
        this.notifyConnectionChange();

        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);

        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.close(1000, 'Client closing connection');
        }

        this.ws = null;
        this.connectionState = 'DISCONNECTED';
        this.notifyConnectionChange();
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    console.error('ChatService error:', error);
    this.errorHandlers.forEach(handler => handler(error));
  }

  notifyConnectionChange() {
    this.connectionHandlers.forEach(handler => handler(this.connectionState));
  }

  cleanup() {
    this.messageHandlers.clear();
    this.errorHandlers.clear();
    this.connectionHandlers.clear();
    this.safeClose();
  }

  async getMessages() {
    try {
      const config = await getAuthHeader();
      const response = await axios.get(`${API_URL}/chat/api/get-messages/`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async sendMessage(data) {
    try {
      const config = await getAuthHeader();
      const response = await axios.post(`${API_URL}/chat/api/send/`, data, config);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
        throw error;
    }
  }

  async searchUsers(username) {
    try {
      const config = await getAuthHeader();
      const response = await axios.get(`${API_URL}/chat/api/search/${username}/`, config);
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
            throw error;
        }
  }

  async markMessagesAsRead(receiverId) {
    try {
      const config = await getAuthHeader();
      const response = await axios.put(`${API_URL}/chat/api/read/${receiverId}/`, {}, config);
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
