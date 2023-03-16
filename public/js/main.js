const chatForm = document.getElementById("chat-form")
const chatMessageUp =document.querySelector(".chat-messages")

// to get the username and room from the url
const { username, room}= Qs.parse(window.location.search,
    {
   ignoreQueryPrefix:"true"
})

console.log(username,room)

let socket= io();

//join chatroom

socket.emit()

socket.on("message", message =>{
    console.log(message)
    outputMessage(message)

    // every time we get a message it has to scroll down
    chatMessageUp.scrollTop =chatMessageUp.scrollHeight;
})

// add message to the chat
chatForm.addEventListener("submit",(e) =>{
    e.preventDefault()
    // get message text
    e.target.elements.msg = "";
    let msg= e.target.elements.msg.value;
    socket.emit("chatMessage", msg)
// to set the message box as a default and focus on the empty input
    e.target.elements.msg.value =""
    e.target.elements.msg.focus();

})

//output the message to DOM
function outputMessage(message){
    const div = document.createElement("div")
    div.classList.add("message");
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
                <p class="text">
                    ${message.text}
                </p>`
    document.querySelector(".chat-messages").appendChild(div)
}
