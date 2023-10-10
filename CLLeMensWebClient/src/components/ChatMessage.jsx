import React from 'react';
import {Typography} from 'antd';

const ChatMessage = ({type, content}) => {
    const isUser = type === "user";
    const backgroundColor = isUser ? "#1890ff" : "#f5f5f5"; // blau für User, grau für Bot
    const color = isUser ? "#ffffff" : "#000000"; // Textfarbe

    return (
        <div style={{
            maxWidth: '80%',
            backgroundColor,
            color,
            borderRadius: '15px',
            padding: '10px 15px',
            marginBottom: '10px',
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            textAlign: 'justify',
            textAlignLast: 'none',
        }}>
            <Typography.Text style={{color}}>{content}</Typography.Text>
        </div>
    );
};

export default ChatMessage;
