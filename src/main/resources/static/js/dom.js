var usernamePage = document.querySelector("#username-page");
var chatPage = document.querySelector("#chat-page");
var messageArea = document.querySelector("#messageArea")
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function showChatPage(){
    username = document.querySelector("#name").value.trim();
    if(username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');
    }
}

function handleUserEvent(message){
    var eventMessage = document.createElement('li');
    eventMessage.classList.add('event-message');
    if(message.type === 'JOIN'){
        message.content = message.sender + ' has joined!'
    } else {
        message.content = message.sender + ' has left!'
    }
    insertEventIntoDOM(eventMessage, message);
}

function handleChatMessage(message){
    var messageElementContainer = document.createElement('div');
    var messageElements = document.createElement('li');
    var textMessageElements = document.createElement('div');
    textMessageElements.classList.add("message-text-elements");

    if (message.sender === username) {
        messageElements.classList.add('message-user');
        messageElementContainer.classList.add('message-user-container')
        insertMessageIntoDOM(messageElements, message, messageElementContainer);
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

        insertMessageIntoDOM(null, message, messageElementContainer, textMessageElements);
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

function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++){
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

function insertMessageIntoDOM(messageElements, message, messageElementContainer, textMessageElements){
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

function insertEventIntoDOM(eventMessage, message){
    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);
    eventMessage.appendChild(textElement);

    messageArea.appendChild(eventMessage);
    messageArea.scrollTop = messageArea.scrollHeight;
}

export {showChatPage, handleUserEvent, handleChatMessage};