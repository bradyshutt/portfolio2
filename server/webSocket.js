// Websocket server

import { WebSocketServer } from 'ws';
import FileSystem from 'fs';
import { transcribeAudioWhisperNode } from './speechToText.js';

export function setupWebSocketServer(server) {
    const webSocketServer = new WebSocketServer({ server, path: '/audio' });

    webSocketServer.on('connection', (webSocket) => {
        console.log('🔌 WebSocket connected');
        const chunks = [];

        webSocket.on('message', async (data) => {
            return;
            chunks.push(data);

            if (chunks.length >= 4) {
                const buffer = Buffer.concat(chunks.map((c) => Buffer.from(c)));

                const filePath = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}.webm`;
                FileSystem.writeFileSync(filePath, buffer);

                console.log('TRANSCRIBIGN');
                const text = await transcribeAudioWhisperNode(filePath);
                console.log('NEW TEXT:', text);

                webSocket.send(JSON.stringify({ text }));

                chunks.length = 0;

                if (FileSystem.existsSync(filePath)) {
                    console.log('DELETING TEMP FILE ', filePath);
                    FileSystem.unlinkSync(filePath);
                }
            }
        });

        webSocket.on('close', () => console.log('🔒 WebSocket closed'));
    });
}
