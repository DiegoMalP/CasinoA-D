import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function App() {
    useEffect(() => {
        if (!window.__n8nChatLoaded) {
            createChat({
                webhookUrl: 'https://hooly-subcontiguous-mitchell.ngrok-free.dev/webhook/4bb5ebc3-dc8f-4ddd-a2ce-52fc9df53e4c/chat',

                chatSessionKey: 'sessionId',
                loadPreviousSession: false,
                enableStreaming: true,

                target: '#n8n-chat',
                mode: 'window',

                showWelcomeScreen: true,
                defaultLanguage: 'en',

                i18n: {
                    en: {
                        title: '¡Bienvenido al chat! 😊',
                        subtitle: 'Estoy aquí para ayudarte en lo que necesites.',
                        getStarted: 'Comenzar chat',
                        footer: 'Disponible 24/7',
                        inputPlaceholder: 'Escribe tu mensaje...'
                    }
                },

                initialMessages: [
                    "¡Bienvenido al chat! 😊",
                    "¿En qué puedo ayudarte hoy?"
                ]
            });

            window.__n8nChatLoaded = true;
        }
    }, []);

    return <div id="n8n-chat"></div>;
}
