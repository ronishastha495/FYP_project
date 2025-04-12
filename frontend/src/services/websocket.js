let socket = null;

export const connectWebSocket = (userId, onMessageReceived) => {
  const token = localStorage.getItem('accessToken');

  // WebSocket URL
  const socketUrl = `ws://localhost:8000/ws/chat/${userId}/?token=${token}`;

  // Create a new WebSocket connection
  socket = new WebSocket(socketUrl);

  // WebSocket event listeners
  socket.onopen = () => {
    console.log('Connected to WebSocket');

    // Optional: You can send an initial message or subscribe to a particular topic
    // socket.send(JSON.stringify({ message: "Hello WebSocket" }));
  };

  socket.onmessage = (event) => {
    console.log('📩 Received message:', event.data ,event);
    // Handle incoming message
    onMessageReceived(JSON.parse(event.data));
  };

  socket.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };

  socket.onclose = (event) => {
    console.log('WebSocket connection closed', event);
  };
};

export const sendMessage = (messageData) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    // Send message to server
    socket.send(JSON.stringify(messageData));
  } else {
    console.error('WebSocket is not open. Cannot send message.');
  }
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
  }
};
