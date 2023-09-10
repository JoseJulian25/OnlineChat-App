import {handleChatMessage, handleUserEvent} from "./dom.js";

var connectingElement = document.querySelector(".connecting")
var stompClient = null;
var username = null;

function connectWebSocket(userInput){
    username = userInput.value.trim();
    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);
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

function sendMessageViaWebSocket(messageInput) {
    const messageContent = messageInput.value.trim();
    if(messageContent && stompClient){
        var chatMessage = {
            sender: username,
            content: messageContent,
            type: 'CHAT'
        };
        stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        handleUserEvent(message);
    } else if (message.type === 'CHAT') {
        handleChatMessage(message);
    }
}

export {connectWebSocket, sendMessageViaWebSocket, onMessageReceived};

