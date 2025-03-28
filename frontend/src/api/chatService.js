// // src/services/chatService.js
// class ChatService {
//     constructor() {
//       this.socket = null;
//       this.listeners = [];
//     }
  
//     connect = (token) => {
//       this.socket = new WebSocket(`ws://localhost:8000/ws/chat/?token=${token}`);
      
//       this.socket.onopen = () => {
//         console.log('WebSocket connected');
//       };
  
//       this.socket.onmessage = (e) => {
//         const data = JSON.parse(e.data);
//         this.listeners.forEach(listener => listener(data));
//       };
  
//       this.socket.onclose = () => {
//         console.log('WebSocket disconnected');
//       };
//     };
  
//     disconnect = () => {
//       if (this.socket) {
//         this.socket.close();
//       }
//     };
  
//     sendMessage = (message, conversationId, senderId) => {
//       if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//         this.socket.send(JSON.stringify({
//           message,
//           conversation_id: conversationId,
//           sender_id: senderId
//         }));
//       }
//     };
  
//     addListener = (listener) => {
//       this.listeners.push(listener);
//       return () => {
//         this.listeners = this.listeners.filter(l => l !== listener);
//       };
//     };
//   }
  
//   export default new ChatService();