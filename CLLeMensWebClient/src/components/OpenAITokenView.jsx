import React, {useState, useEffect} from 'react';
import {Input, Button, Typography} from 'antd';
const {Title} = Typography;

const OpenAITokenView = () => {
    const [apiToken, setApiToken] = useState('');
    const [initialApiToken, setInitialApiToken] = useState('');

    // GET-Anfrage, um den bestehenden API-Token zu holen
    useEffect(() => {
        const fetchApiToken = async () => {
            try {
                const response = await makeRequest('YOUR_ENDPOINT_URL', 'GET');
                const data = await response.json();
                setApiToken(data.token);
                setInitialApiToken(data.token);
            } catch (error) {
                console.error("Failed to fetch API token:", error);
            }
        };

        fetchApiToken();
    }, []);

    // POST-Anfrage, um den API-Token zu aktualisieren
    const updateApiToken = async () => {
        try {
            await makeRequest('YOUR_ENDPOINT_URL', 'POST', {token: apiToken});
            setInitialApiToken(apiToken);
        } catch (error) {
            console.error("Failed to update API token:", error);
        }
    };

    const isButtonDisabled = !apiToken || apiToken === initialApiToken;

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

    const makeRequest = async (url, method, body = null) => {
        const headers = {
            'Content-Type': 'application/json',
            // Add any other headers if needed
        };

        const config = {
            method,
            headers,
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(url, config);
        return response;
    };


    return (
        <div className="chat-wrapper">
            <Title style={{color: '#fff'}}>OpenAI Token</Title>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <Input
                    value={apiToken}
                    maxLength={55}
                    onChange={e => setApiToken(e.target.value)}
                    placeholder="Enter API Token"
                    style={{marginRight: '10px'}}
                />
                <Button
                    type={'primary'}
                    disabled={isButtonDisabled}
                    onClick={updateApiToken}
                    style={isButtonDisabled ? disabledButtonStyle : enabledButtonStyle}>
                    Update Token
                </Button>
            </div>
        </div>
    );
};


export default OpenAITokenView;
