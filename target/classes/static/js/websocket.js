import {handleChatMessage, handleUserEvent} from "./dom.js";

const connectingElement = document.querySelector(".connecting")
let stompClient = null;
let username = null;
let userId = null;

function connectWebSocket(userInput){
    username = userInput.value.trim();
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, onConnected, onError);
}

function onConnected() {
    stompClient.subscribe("/topic/public", onMessageReceived);
    stompClient.send("/app/chat.addUser", {}, JSON.stringify({sender: username, type: 'JOIN'}));
    connectingElement.classList.add('hidden');
}

function onError() {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page and try!';
    connectingElement.style.color = 'red';
}

function sendMessageViaWebSocket(messageInput) {
    const messageContent = messageInput.value.trim();
    if(messageContent && stompClient){
        const chatMessage = {
            id: userId,
            sender: username,
            content: messageContent,
            type: 'CHAT'
        };
        stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
}

function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    if(!userId) userId = message.id;

    if (message.type === 'JOIN' || message.type === 'LEAVE') {
        handleUserEvent(message);
    } else if (message.type === 'CHAT') {
        handleChatMessage(message, userId);
    }
}

export {connectWebSocket, sendMessageViaWebSocket, onMessageReceived};

