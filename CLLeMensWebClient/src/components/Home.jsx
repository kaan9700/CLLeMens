// Home.js
import React from 'react';
import {Typography, Button, Card, Row, Col} from 'antd';
import {useNavigate} from "react-router-dom";
import {Divider} from 'antd';

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
            <Divider style={{backgroundColor: 'lightgray', margin: '75px 0'}}/>
            {/* Call to Action */}
            <Title level={2} style={{color: '#fff'}}>Get Started</Title>
            <Paragraph style={{color: '#fff'}}>
                Ready to make your life easier with CLLeMens?
            </Paragraph>
            <Button type="primary" size="large" onClick={handleStartNow}>Start Now</Button>
            <Divider style={{backgroundColor: 'lightgray', margin: '75px 0'}}/>
            {/* Features */}
            <Title level={2} style={{color: '#fff'}}>Features</Title>
            <Row gutter={16} className="card-container">

                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Card title="Robotic Assistance" className="feature-card">
                        <Paragraph>
                            Experience a seamless robotic assistant that intuitively follows you, offering immediate
                            support and guidance.
                        </Paragraph>
                        <Paragraph strong>Key Feature:</Paragraph>
                        <Paragraph>
                            Follow-Me functionality through advanced sensors.
                        </Paragraph>
                    </Card>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Card title="Personalized Knowledge Base" className="feature-card">
                        <Paragraph>
                            Create a unique knowledge foundation by integrating diverse documents like PDFs, Word files,
                            web pages, and even YouTube videos.
                        </Paragraph>
                        <Paragraph strong>Use Cases:</Paragraph>
                        <ul>
                            <li>Students adding course materials for study assistance.</li>
                            <li>Business owners integrating company-specific documents for quick access.</li>
                            <li>Researchers incorporating scientific articles for in-depth inquiries.</li>
                        </ul>
                    </Card>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Card title="Cutting-Edge Technologies" className="feature-card">
                        <Paragraph>
                            Leverage the power of GPT-4 for advanced language processing and comprehension.
                        </Paragraph>
                        <Paragraph strong>Interface & Communication:</Paragraph>
                        <Paragraph>
                            Interact via Alexa for voice-based queries and utilize a user-friendly web interface for
                            document uploading, categorization, and management.
                        </Paragraph>
                    </Card>
                </Col>

            </Row>


        </div>
    );
};

export default Home;
