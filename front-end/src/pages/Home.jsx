import React, { useState } from "react";
import axios from 'axios';

const Home = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [chatHistory, setChatHistory] = useState('');

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        const userMessage = { sender: 'User', text: message };
        setChat(prevChat => [...prevChat, userMessage]);

        try {
            const response = await axios.post('http://localhost:3001/api/converse', { message, chatHistory });

            console.log('Server response:', response.data); // Log the server response

            // Assuming the response structure is { result: { input, chatHistory, context, answer } }
            const therapistMessage = { sender: 'Therapist', text: response.data.result };
            setChat(prevChat => [...prevChat, therapistMessage]);

            // Update the chat history with the latest conversation
            setChatHistory(response.data.chatHistory);
        } catch (error) {
            console.error('Error sending message:', error);
        }

        setMessage('');
    };

    const styles = {
        app: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f0f0',
        },
        chatContainer: {
            width: '400px',
            backgroundColor: 'white',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            overflow: 'hidden',
        },
        chatBox: {
            height: '400px',
            overflowY: 'auto',
            padding: '20px',
            borderBottom: '1px solid #ddd',
        },
        chatMessage: {
            marginBottom: '10px',
        },
        userMessage: {
            textAlign: 'right',
        },
        therapistMessage: {
            textAlign: 'left',
        },
        chatForm: {
            display: 'flex',
            padding: '10px',
        },
        chatInput: {
            flex: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginRight: '10px',
        },
        chatButton: {
            padding: '10px 20px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer',
        },
    };

    return (
        <div style={styles.app}>
            <div style={styles.chatContainer}>
                <div style={styles.chatBox}>
                    {chat.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                ...styles.chatMessage,
                                ...(msg.sender === 'User' ? styles.userMessage : styles.therapistMessage),
                            }}
                        >
                            <strong>{msg.sender}:</strong> {msg.text}
                        </div>
                    ))}
                </div>
                <form style={styles.chatForm} onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        required
                        style={styles.chatInput}
                    />
                    <button type="submit" style={styles.chatButton}>Send</button>
                </form>
            </div>
        </div>
    );
}

export default Home;
