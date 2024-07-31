const socket = io();

socket.emit("message", "Client connected to Socket");

const userDataDiv = document.getElementById('userData');
const user = userDataDiv.dataset.user;

const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

async function startChat() {
    socket.on("messages", data => {
        let messages = '';
        if (Array.isArray(data)) {
            data.forEach(message => {
                if (message && typeof message.message === 'string') {
                    const userName = message.user ? `<strong>${message.user}:</strong> ` : '';
                    messages += `<p class="border-bottom py-2">${userName}${message.message}</p>`;
                }
            });
        }
        chatBox.innerHTML = messages;
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    messageInput.addEventListener('keyup', e => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    sendButton.addEventListener('click', () => {
        sendMessage();
    });

    function sendMessage() {
        if (messageInput.value.trim().length > 0) {
            socket.emit("message", { user: user, message: messageInput.value });
            messageInput.value = '';
        }
    }
}

startChat();