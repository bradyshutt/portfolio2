import Layout from '@/components/Layout';
import styles from './ChatPage.module.scss';
import Message from '../Message/Message';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Button, Textarea } from '@mantine/core';
import recordingService from '@/services/RecordingService';
import { chatAudio, chatText } from '@/api/api';

export default function ChatPage() {

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [liveText, setLiveText] = useState('');
    const audioChunksRef = useRef<Array<Blob>>([]);
    const [messages, setMessages] = useState<Array<any>>([]);
    const [textInputValue, setTextInputValue] = useState('');

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

    // Init
    useEffect(() => {
        recordingService.init()
        // Hook up Observable isRecording state
        const sub = recordingService.isRecording$.subscribe(setIsRecording);
        return () => sub.unsubscribe();
    }, []);

    const startRecording = async () => {
        recordingService.startRecording()
            .then((buffer) => {
                console.log('Recording finished');
                handleUploadAudio(buffer)
            });
    };

    const stopRecording = async () => {
        recordingService.stopRecording();
        setIsRecording(false);
    };

    const decodeAndPlayResponseAudio = (base64Audio: string) => {

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

        audio.play();

    };


    const handleUploadAudio = async (audioChunks: Array<Blob>) => {
        setLoading(true);

        chatAudio(audioChunks)
        
        .then(async (response) => {
            console.log('response', response);
            const responseJson = await response.json();
            console.log('responseJson', responseJson);

            // Extract the Base64 encoded audio
            decodeAndPlayResponseAudio(responseJson.audio);

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
            setLoading(false);
        });
    };

    const handleUploadText = async (text: string) => {
        setLoading(true);

        chatText(text)
        .then(async (response) => {   
            console.log('response', response);
            const responseJson = await response.json();
            console.log('responseJson', responseJson);

            // Extract the Base64 encoded audio
            decodeAndPlayResponseAudio(responseJson.audio);

            setMessages([
                ...messages,
                {
                    role: 'user',
                    content: text,
                    timestamp: new Date().toISOString(),
                },
                {
                    role: 'assistant',
                    content: responseJson.reply,
                    timestamp: new Date().toISOString(),
                },
            ]);
            setTextInputValue('');
            setLoading(false);
        });
    };

    return (
        <Layout>
            <div className={styles.chatPage}>
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


                <div className={styles.bottomBar}>
                    <div className={styles.textInputWrapper}>
                        <Textarea
                            value={textInputValue}
                            placeholder="Type your message..."
                            className={styles.inputField}
                            onChange={(e) => setTextInputValue(e.currentTarget.value)}
                        />
                        <div className={styles.sendButtonContainer}>
                            <Button 
                                onClick={() => handleUploadText(textInputValue)}
                                className={styles.sendButton}
                            >
                                    Send
                            </Button>
                        </div>
                    </div>

                    <div className={styles.buttons}>
                        <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            color="red"
                            className={styles.recordButton}
                        >
                            {isRecording ? 'Stop Recording' : 'Start Talking'}
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}