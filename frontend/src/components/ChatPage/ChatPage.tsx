import Layout from '@/components/Layout';
import styles from './ChatPage.module.css';
import Message from '../Message/Message';
import { useRef, useState } from 'react';
import { Button } from '@mantine/core';


export default function ChatPage() {

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [liveText, setLiveText] = useState('');
    const mediaRecorderRef = useRef<null | MediaRecorder>(null);
    const audioChunksRef = useRef<Array<Blob>>([]);
    const [messages, setMessages] = useState<Array<any>>([]);

    // const messages = [
    //     {
    //         role: 'assistant',
    //         content: 'Hello, how can I help you today?',
    //         timestamp: (new Date(Date.now() - 1000 * 30)).toISOString(),
    //     },
    //     {
    //         role: 'user',
    //         content: 'Hello, how are you?',
    //         timestamp: new Date().toISOString(),
    //     }
    // ];

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
                // socket.send(event.data);
            }
        };

        mediaRecorderRef.current.onstop = handleUpload;

        mediaRecorderRef.current.start();
        // mediaRecorderRef.current.start(250); // Send data every 250ms
        setRecording(true);
    };

    const stopRecording = () => {
        console.log('STOP RECORDING');
        mediaRecorderRef.current.stop();
        setRecording(false);
    };

    const handleUpload = async () => {
        setLoading(true);

        console.log('audioChunksRef.current', audioChunksRef.current);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                body: formData
            });

            console.log('res', res);
            console.log('Content-Type:', res.headers.get('Content-Type'));
            const responseJson = await res.json();

            console.log('responseJson', responseJson);

            // Extract the Base64 encoded audio
            const base64Audio = responseJson.audio;

            // Decode the Base64 string into a binary Blob
            // Decode Base64 to binary
            const binaryAudio = atob(base64Audio);

            const audioArray = new Uint8Array(binaryAudio.length);
            for (let i = 0; i < binaryAudio.length; i++) {
                audioArray[i] = binaryAudio.charCodeAt(i);
            }

            const blob = new Blob([audioArray], { type: 'audio/mpeg' });
            console.log('blob', blob);

            const url = URL.createObjectURL(blob);
            console.log('url', url);
            const audio = new Audio(url);
            console.log('audio', audio);
            setMessages([
                ...messages,
                {
                    role: 'user',
                    content: responseJson.userMessage,
                    timestamp: new Date().toISOString(),
                },
                {
                    role: 'assistant',
                    content: responseJson.reply,
                    timestamp: new Date().toISOString(),
                },
            ]);
            audio.play();
        } catch (e) {
            console.error('Error:', e);
        }

        setLoading(false);
    };



    return (
        <Layout>
            <div className={styles.chatPage }>
                <div className={styles.chatMessages}>
                    {messages.map((message, index) => (
                        <Message
                            key={index}
                            role={message.role}
                            content={message.content}
                            timestamp={message.timestamp}
                        />
                    ))}
                </div>
            </div>


            <div className={styles.bottomBar}>
                <Button onClick={recording ? stopRecording : startRecording}>
                    {recording ? 'Stop Recording' : 'Start Talking'}
                </Button>
            </div>

            {recording && (
                <div style={{ marginTop: '1rem' }}>
                    <p><strong>transcribing:</strong> {liveText}</p>
                </div>
            )}

            {loading && <p>💬 Processing...</p>}

        </Layout>
    );
}