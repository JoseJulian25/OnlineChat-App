'use strict';

var usernamePage = document.querySelector("#username-page");
var chatPage = document.querySelector("#chat-page");
var usernameForm = document.querySelector("#usernameForm")
var messageForm = document.querySelector("#messageForm")
var messageInput = document.querySelector("#message")
var messageArea = document.querySelector("#messageArea")
var connectingElement = document.querySelector(".connecting")

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];


function connect(event) {
    username = document.querySelector("#name").value.trim();
    if(username){
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

function onConnected() {
    stompClient.subscribe("/topic/public", onMessageReceived);

    stompClient.send("/app/chat.addUser", {}, JSON.stringify({sender: username, type: 'JOIN'}));
    connectingElement.classList.add('hidden');
}

function onError() {
    connectingElement.textContent = 'Could not connect to WebSocket server. PLease refresh this page and try!';
    connectingElement.style.color = 'red';
}


function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        handleUserEvent(message);
    } else if (message.type === 'CHAT') {
        handleChatMessage(message);
    }
}

function handleUserEvent(message) {
    var eventMessage = document.createElement('li');
    eventMessage.classList.add('event-message');
    if(message.type === 'JOIN'){
        message.content = message.sender + ' has joined!'
    } else {
        message.content = message.sender + ' has left!'
    }
    insertEventsDOM(eventMessage, message);
}

function handleChatMessage(message) {
    var messageElementContainer = document.createElement('div');
    var messageElements = document.createElement('li');
    var textMessageElements = document.createElement('div');
    textMessageElements.classList.add("message-text-elements");

    if (message.sender === username) {
        messageElements.classList.add('message-user');
        messageElementContainer.classList.add('message-user-container')
        insertMessagesDOM(messageElements, message, messageElementContainer);
    } else {
        messageElements.classList.add('message-other-elements');
        messageElementContainer.classList.add('message-other-container')

        var avatarElement = getAvatarUser(message);
        messageElements.appendChild(avatarElement);
        messageElementContainer.appendChild(messageElements);

        var usernameElement = document.createElement('span');
        usernameElement.style['color'] = getAvatarColor(message.sender);

        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        textMessageElements.appendChild(usernameElement);
        messageElements.appendChild(textMessageElements);

        insertMessagesDOM(null, message, messageElementContainer, textMessageElements);
    }
}

function getAvatarUser(message){
    var avatarElement = document.createElement('i');
    avatarElement.classList.add('avatar-user')
    var avatarText = document.createTextNode(message.sender[0]);
    avatarElement.appendChild(avatarText);
    avatarElement.style['background-color'] = getAvatarColor(message.sender);
    return avatarElement;
}

function insertEventsDOM(messageElement, message){
    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);
    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function insertMessagesDOM(messageElements, message, messageElementContainer, textMessageElements) {
        var textElement = document.createElement('p');
        var messageText = document.createTextNode(message.content);
        textElement.appendChild(messageText);
        if(messageElements){
            messageElements.appendChild(textElement);
            messageElementContainer.appendChild(messageElements)
        }else if (textMessageElements){
            textMessageElements.appendChild(textElement);
        }
        messageArea.appendChild(messageElementContainer);
        messageArea.scrollTop = messageArea.scrollHeight;
}


function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if(messageContent && stompClient){
        var chatMessage = {
            sender: username,
            content: messageContent,
            type: 'CHAT'
        };
        stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}



function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++){
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);