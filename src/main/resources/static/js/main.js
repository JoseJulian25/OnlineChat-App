import {connectWebSocket, sendMessageViaWebSocket} from './websocket.js';
import {showChatPage} from "./dom.js";

var usernameForm = document.querySelector("#usernameForm")
var messageInput = document.querySelector("#message");
var messageForm = document.querySelector("#messageForm")
var userInput = document.querySelector("#name");

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