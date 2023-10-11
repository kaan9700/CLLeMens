import React, {useState, useEffect} from 'react';
import {Input, Button, Typography} from 'antd';
import {OPENAI_TOKEN} from "../api/endpoints.js";
import {makeRequest} from "../api/api.js";
import Notifications from "./Notifications.jsx";
const {Title} = Typography;

const OpenAITokenView = () => {
    const [apiToken, setApiToken] = useState('');
    const [initialApiToken, setInitialApiToken] = useState('');

    // GET-Anfrage, um den bestehenden API-Token zu holen
    useEffect(() => {
        const fetchApiToken = async () => {
            try {
                const response = await makeRequest('GET', OPENAI_TOKEN);


                if ('token' in response) {
                    setApiToken(response.token);
                    setInitialApiToken(response.token);
                }


            } catch (error) {
                console.error("Failed to fetch API token:", error);
            }
        };

        fetchApiToken();
    }, []);

    // POST-Anfrage, um den API-Token zu aktualisieren
    const updateApiToken = async () => {
        try {
            await makeRequest('POST', OPENAI_TOKEN, {'token': apiToken});
            setInitialApiToken(apiToken);
            Notifications('success', {'message': 'Failed', 'description': 'API Token saved'})
        } catch (error) {

            Notifications('error', {'message': 'Successful', 'description': error.message})
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


    return (
        <div className="chat-wrapper">
            <Title style={{color: '#fff'}}>OpenAI Token</Title>
            <p style={{color: '#fff', marginBottom: '20px'}}>To enable integration with OpenAI's GPT-4, an API token is
                required.</p>
            <div style={{display: 'flex', alignItems: 'center'}} className={'openai-token-wrapper'}>
                <Input
                    value={apiToken}
                    maxLength={55}
                    onChange={e => setApiToken(e.target.value)}
                    placeholder="Enter API Token"
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
