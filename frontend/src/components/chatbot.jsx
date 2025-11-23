import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';


export default function App() {
    useEffect(() => {
        if (!window.__n8nChatLoaded) {
            createChat({
                webhookUrl: 'https://hooly-subcontiguous-mitchell.ngrok-free.dev/webhook/8f9f9fe8-49bd-4aad-800b-5f4868fc68de/chat',
                chatSessionKey: 'sessionId',
                loadPreviousSession: true,
                enableStreaming: true,
                target: '#n8n-chat',
                mode: 'window',
                showWelcomeScreen: true,
                defaultLanguage: 'en'
            });

            window.__n8nChatLoaded = true; // <- evita que vuelva a montarse
        }
    }, []);


    return <div id="n8n-chat"></div>;
}
