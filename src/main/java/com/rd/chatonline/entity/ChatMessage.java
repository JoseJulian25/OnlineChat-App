package com.rd.chatonline.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@AllArgsConstructor
@Data
@Builder
public class ChatMessage {
    private String id;
    private String content;
    private String sender;
    private MessageType type;
}
