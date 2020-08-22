const socket = io();
const chatForm = document.getElementById('send-form');
const messages =  document.querySelector('.chat-box');

function getUsername(){
    var username = prompt("Please enter your name: ");
    while (username == null || username == '' || username[0] == '@' || username.indexOf(' ') != -1 || username == 'ChatBot'){
        username = prompt("You Can Not Do That! Please enter another name: ");
    }
    return username;
}

var username = getUsername();
socket.emit('checkAv', username);

socket.on('checkAvRes', res => {
    if (res == "TAKEN") {
        alert("This is Already Taken!");
        username = getUsername();
        socket.emit('checkAv', username);
    }
});

function outputMessage(big_msg) {
    var user = big_msg.sender;
    var message = big_msg.msg;
    const div = document.createElement('div');
    div.classList.add('chatMessage');
    if(user == username){
        div.innerHTML = "<span class='self-sender'>" + user + ": </span>" + message;
    }else {
        div.innerHTML = "<span class='sender-name'>" + user + ": </span>" + message;
    }
    document.querySelector('.chat-box').appendChild(div);
}

socket.on('message', big_msg => {
    outputMessage(big_msg);
});

chatForm.addEventListener('submit', event => {
    event.preventDefault();
    const msgg = event.target.elements.message.value;
    socket.emit('chatMSG', {msg: msgg, sender:username} );
    event.target.elements.message.value = '';
    event.target.elements.message.focus();
    messages.scrollTop = messages.scrollHeight;
});