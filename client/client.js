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
    else {
        socket.emit('loadChat');
    }
});
function getTime(){
    var d = new Date();
    var h = d.getHours().toLocaleString();
    if (h.length == 1){
        h = '0' + h;
    }
    var m = d.getMinutes().toLocaleString();
    if (m.length == 1){
        m = '0' + m;
    }
    return h + ":" + m;
}
function outputMessage(big_msg) {
    var user = big_msg.sender;
    var message = big_msg.msg;
    const div = document.createElement('div');
    if(user == 'ChatBot') {
        div.classList.add('systemMessage');
        div.innerHTML = "<span class='time'>" + getTime() + " </span>" + message;
    }
    else if(user == username){
        div.classList.add('chatMessage');
        div.innerHTML =
        "<span class='time'>" + getTime() + " </span>"+
        "<span class='self-sender'>" + user + ": </span>" + 
        message;
    }else {
        div.classList.add('chatMessage');
        div.innerHTML =
        "<span class='time'>" + getTime() + " </span>"+
        "<span class='sender-name'>" + user + ": </span>" + 
        message;    
    }
    document.querySelector('.chat-box').appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

socket.on('message', big_msg => {
    outputMessage(big_msg);
});

chatForm.addEventListener('submit', event => {
    event.preventDefault();
    const msgg = event.target.elements.message.value;
    if (msgg){socket.emit('chatMSG', {msg: msgg, sender:username} );}
    event.target.elements.message.value = '';
    event.target.elements.message.focus();
});