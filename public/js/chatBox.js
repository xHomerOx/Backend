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
}).then(result => {
    user = result.value;
})

chatBox.addEventListener('keyup', e => {
    if(e.key === "Enter") {
        if (chatBox.value.trim().length >= 0) {
            socket.emit("message", {user: user, message: chatBox.value});
            chatBox.value = '';
        }
    }
});

socket.on("messages", data => {
    let logs = document.getElementById("message");
    let messages = '';
    data.forEach(message => {
        messages += `${message.user}: ${message.message} <br>`
    })
    logs.innerHTML = messages;
    console.log(messages);
})
