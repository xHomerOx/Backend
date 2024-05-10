const socket = io();

socket.emit("message", "Client connected to Socket");

socket.on('connect', () => {
    console.log('Client connected to Socket');
});

let user;
let chatBox = document.getElementById('chatBox');

Swal.fire({
    title: "Usuario",
    input: "text",
    text: "Ingrese su e-mail",
    inputValidator: (value) => {
        return !value && "Ingrese su usuario/mail";
    }
}).then(async (result) => {
    user = result.value;
    await startChat();
})

async function startChat() {
    socket.on("messages", data => {
        let logs = document.getElementById("message");
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
        console.log(messages);
    })

    chatBox.addEventListener('keyup', e => {
        if(e.key === "Enter") {
            if (chatBox.value.trim().length >= 0) {
                socket.emit("message", {user: user, message: chatBox.value});
                chatBox.value = '';
            }
        }
    });
}