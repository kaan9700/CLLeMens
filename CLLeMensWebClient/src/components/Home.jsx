// Home.js
import React from 'react';
import {Typography, Button, Card, Row, Col} from 'antd';
import {useNavigate} from "react-router-dom";

const {Title, Paragraph} = Typography;

const Home = () => {
    const navigate = useNavigate();

    const handleStartNow = () => {
        navigate('/upload');

    }

    return (
        <div className="home-container">
            {/* Introduction */}
            <Title style={{color: '#fff'}}>Welcome to CLLeMens</Title>
            <Paragraph style={{color: '#fff'}}>
                Your personal robot assistant with "Follow-Me" functionality.
            </Paragraph>

            {/* Features */}
            <Title level={2} style={{color: '#fff'}}>Features</Title>
            <Row gutter={16} className="card-container">
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Card title="Follow-Me & Kommunikation" className="feature-card">
                        <Paragraph>
                            Ihr Assistent folgt Ihnen überallhin und bietet Echtzeitunterstützung.
                            Erleben Sie intuitive Gespräche für eine organische Interaktion.
                        </Paragraph>
                        <Paragraph strong>Technologie: </Paragraph>
                        <Paragraph>Follow-Me über Sensoren, Alexa für Sprachkommunikation.</Paragraph>
                    </Card>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Card title="Personalisierte Informationen" className="feature-card">
                        <Paragraph>
                            Fügen Sie Ihre eigenen Dokumente und Medien für hochgradig individuelle und kontextbewusste
                            Antworten hinzu.
                        </Paragraph>
                        <Paragraph strong>Anwendungsfälle:</Paragraph>
                        <Paragraph>Studenten können Kursmaterialien, Geschäftsinhaber können firmeninterne Dokumente
                            hinzufügen.</Paragraph>
                    </Card>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Card title="Technologische Highlights" className="feature-card">
                        <Paragraph>
                            CLLeMens wird von GPT-4 für fortschrittliche Sprachverarbeitung angetrieben.
                        </Paragraph>
                        <Paragraph strong>Weitere Technologien:</Paragraph>
                        <Paragraph>
                            Alexa für Sprachkommunikation, Webinterface zur Dokumentenverwaltung.
                        </Paragraph>
                    </Card>
                </Col>
            </Row>

            {/* Call to Action */}
            <Title level={2} style={{color: '#fff'}}>Get Started</Title>
            <Paragraph style={{color: '#fff'}}>
                Ready to make your life easier with CLLeMens?
            </Paragraph>
            <Button type="primary" size="large" onClick={handleStartNow}>Start Now</Button>
        </div>
    );
};

export default Home;
