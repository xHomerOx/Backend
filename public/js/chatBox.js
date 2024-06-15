const socket = io();

socket.emit("message", "Client connected to Socket");

const userDataDiv = document.getElementById('userData');
const user = userDataDiv.dataset.user;

const chatBox = document.getElementById('chatBox');

async function startChat() {
    socket.on("messages", data => {
        const logs = document.getElementById("message");
        let messages = '';
        if (data && data.length > 0) {
            data.forEach(message => {
                if (message.user) {
                    messages += `${message.user}: ${message.message} <br>`;
                } else {
                    messages += `<br>`;
                }
            })
        }
        logs.innerHTML = messages;
    })

    chatBox.addEventListener('keyup', e => {
        if(e.key === "Enter") {
            if (chatBox.value.trim().length > 0) {
                socket.emit("message", {user: user, message: chatBox.value});
                chatBox.value = '';
            }
        }
    });
}

startChat();
