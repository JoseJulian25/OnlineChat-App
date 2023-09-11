package com.rd.chatonline.controller;

import com.rd.chatonline.entity.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
public class ChatController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage message){
        return message;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(@Payload ChatMessage message, SimpMessageHeaderAccessor headerAccessor){
        String idUser = UUID.randomUUID().toString();
        ChatMessage messageboxes = new ChatMessage(idUser, message.getContent(), message.getSender(), message.getType());

        headerAccessor.getSessionAttributes().put("id", messageboxes.getId());
        headerAccessor.getSessionAttributes().put("username", messageboxes.getSender());

        return messageboxes;
    }
}
