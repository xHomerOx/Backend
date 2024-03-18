const socket = io();

socket.emit("message", "Client connected to Socket");

socket.on('connect', () => {
    console.log('Client connected to Socket');
});
