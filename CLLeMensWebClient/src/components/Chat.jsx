import React, {useState, useRef, useEffect} from 'react';
import {Input, Button, Divider, Typography} from 'antd';
import ChatMessage from "./ChatMessage.jsx";
import {SEND_MESSAGE} from "../api/endpoints.js";
import {makeRequest} from "../api/api.js";

const {Title} = Typography;


const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const handleSend = async () => {
        if (inputValue.trim() !== '') {
            setMessages([...messages, { type: 'user', content: inputValue.trim() }]);

            try {
                // Nachricht an das Backend senden
                const response = await makeRequest('POST', SEND_MESSAGE, { message: inputValue.trim() });

                // Antwort vom Backend in den Chat einfügen
                if (response && response.reply) {
                    setMessages(prevMessages => [...prevMessages, { type: 'bot', content: response.reply }]);
                }

            } catch (error) {
                console.error("Fehler beim Senden der Nachricht:", error);
                setMessages(prevMessages => [...prevMessages, { type: 'bot', content: "Es gab ein Problem beim Senden Ihrer Nachricht." }]);
            }

            setInputValue('');
        }
    };

    const enabledButtonStyle = {
        width: '40%',
        maxWidth: '120px',
    };

    const disabledButtonStyle = {
        ...enabledButtonStyle,
        backgroundColor: '#ccc',
        color: 'white',
        cursor: 'not-allowed',
    };
    useEffect(() => {
        // Automatisches Scrollen zu den neuesten Nachrichten
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages]);

    return (
        <div className="chat-wrapper">
            <Title style={{color: '#fff'}}>Chat</Title>
            <div style={{

                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                flexGrow: '1',
                flexShrink: '1',
                minHeight: '0',
                border: '1px solid #f0f0f0',
                borderRadius: '10px',
                padding: '20px',
                boxSizing: 'border-box'
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    flex: 1,
                    overflowY: 'auto',
                    paddingBottom: '20px',
                }}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                                padding: '10px',
                            }}
                        >
                            <ChatMessage type={message.type} content={message.content}/>
                        </div>
                    ))}
                    <div ref={messagesEndRef}></div>
                </div>
                <Divider/>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <Input
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        placeholder="Nachricht eingeben..."
                        onPressEnter={handleSend}
                        style={{marginRight: '10px', flexGrow: 1}}
                    />
                    <Button type='primary' onClick={handleSend} disabled={!inputValue.trim()}
                            style={!inputValue.trim() ? disabledButtonStyle : enabledButtonStyle}>Senden</Button>

                </div>
            </div>
        </div>
    );
};

export default Chat;
