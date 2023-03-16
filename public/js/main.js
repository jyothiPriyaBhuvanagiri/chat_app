
const chatForm = document.getElementById("chat-form")

let socket= io();

socket.on("message", message =>{
    console.log(message)
})

// add message to the chat
chatForm.addEventListener("submit",(e) =>{
    e.preventDefault()
    // get message text
    e.target.elements.msg = "";
    let msg= e.target.elements.msg.value;
    socket.emit("chatMessage", msg)

})
