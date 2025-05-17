import { useState, useRef, useEffect } from 'react';

export default function App() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [liveText, setLiveText] = useState('');
    const mediaRecorderRef = useRef<null | MediaRecorder>(null);
    const audioChunksRef = useRef<Array<Blob>>([]);

    // Init Websocket connection
    // useEffect(() => {
    //     const websocket = new WebSocket('ws://localhost:3001/audio');
    //     websocket.onopen = () => {
    //         console.log('WebSocket connection established');
    //     };

    //     websocket.onmessage = (event) => {
    //         const data = JSON.parse(event.data);
    //         console.log('Received data:', data);

    //         // if (msg.type === 'partial') {
    //         //     setLiveText(msg.text);
    //         // } else if (msg.type === 'final') {
    //         //     // You could trigger GPT response here instead
    //         //     console.log('Final transcription:', msg.text);
    //         // }
    //         setLiveText(data);

    //         if (data.text) {
    //             setLiveText(data.text);
    //         }

    //         if (data.audio) {
    //             const audioBlob = new Blob([data.audio], { type: 'audio/mpeg' });
    //             const url = URL.createObjectURL(audioBlob);
    //             const audio = new Audio(url);
    //             audio.play();
    //         }
    //     };

    //     setSocket(websocket);

    //     return () => {
    //         websocket.close();
    //         console.log('WebSocket connection closed');
    //     };
    // }, []);

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
            audio.play();
        } catch (e) {
            console.error('Error:', e);
        }

        setLoading(false);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h1>🎤 Voice Chatbot</h1>

            <button onClick={recording ? stopRecording : startRecording}>
                {recording ? 'Stop Recording' : 'Start Talking'}
            </button>

            {recording && (
                <div style={{ marginTop: '1rem' }}>
                    <p><strong>transcribing:</strong> {liveText}</p>
                </div>
            )}

            {loading && <p>💬 Processing...</p>}
        </div>
    );
}