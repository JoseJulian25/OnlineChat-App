import {connectWebSocket, sendMessageViaWebSocket} from './websocket.js';
import {showChatPage} from "./dom.js";

const usernameForm = document.querySelector("#usernameForm")
const messageInput = document.querySelector("#message");
const messageForm = document.querySelector("#messageForm")
const userInput = document.querySelector("#name");

function connect(event){
    showChatPage();
    connectWebSocket(userInput);
    event.preventDefault();
}

function sendMessage(event){
    sendMessageViaWebSocket(messageInput);
    event.preventDefault()
}

usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);