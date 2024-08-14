const usernamePage = document.querySelector("#username-page");
const chatPage = document.querySelector("#chat-page");
const messageArea = document.querySelector("#messageArea")
let username = null;

const colors = [
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
    const eventMessage = document.createElement('li');
    eventMessage.classList.add('event-message');

    if(message.type === 'JOIN'){
        message.content = message.sender + ' has joined!'
    } else {
        message.content = message.sender + ' has left!'
    }

    insertEventIntoDOM(eventMessage, message);
}

function handleChatMessage(message, userId){
    const messageElementContainer = document.createElement('div');
    const messageElements = document.createElement('li');
    const textMessageElements = document.createElement('div');
    textMessageElements.classList.add("message-text-elements");

    if (message.id === userId) {
        messageElements.classList.add('message-user');
        messageElementContainer.classList.add('message-user-container')
        insertMessageIntoDOM(messageElements, message, messageElementContainer);
    } else {
        messageElements.classList.add('message-other-elements');
        messageElementContainer.classList.add('message-other-container')

        const avatarElement = getAvatarUser(message);
        messageElements.appendChild(avatarElement);
        messageElementContainer.appendChild(messageElements);

        const usernameElement = document.createElement('span');
        usernameElement.style['color'] = getAvatarColor(message.sender);

        const usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        textMessageElements.appendChild(usernameElement);
        messageElements.appendChild(textMessageElements);

        insertMessageIntoDOM(null, message, messageElementContainer, textMessageElements);
    }
}

function getAvatarUser(message){
    const avatarElement = document.createElement('i');
    avatarElement.classList.add('avatar-user')

    const avatarText = document.createTextNode(message.sender[0]);
    avatarElement.appendChild(avatarText);
    avatarElement.style['background-color'] = getAvatarColor(message.sender);
    return avatarElement;
}

function getAvatarColor(messageSender) {
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++){
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
}

function insertMessageIntoDOM(messageElements, message, messageElementContainer, textMessageElements){
    const textElement = document.createElement('p');
    const messageText = document.createTextNode(message.content);
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
    const textElement = document.createElement('p');
    const messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);
    eventMessage.appendChild(textElement);

    messageArea.appendChild(eventMessage);
    messageArea.scrollTop = messageArea.scrollHeight;
}

export {showChatPage, handleUserEvent, handleChatMessage};