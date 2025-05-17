
import express from 'express';

import { OpenAI } from 'openai';
import Multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { textToSpeech } from '../server/textToSpeech.js';
import { transcribeAudio, transcribeAudioWhisperNode } from '../server/speechToText.js';
import dotenv from 'dotenv';
import convertWebmToWav from '../server/middleware/convertWebmToWav.js';
import whisperTranscribeAudio from '../server/middleware/whisperTranscribeAudio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
const router = express.Router();
const uploadDestination = path.join(__dirname, '../uploads');

const storage = Multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDestination);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

// Disk storage
// const upload = Multer({
//     dest: './uploads',
//     storage: storage
// });

// In-Memory storage
const upload = Multer({
    storage: Multer.memoryStorage()
});


router.post('/chat',
    upload.single('audio'),
    convertWebmToWav,
    whisperTranscribeAudio,
    async (req, res) => {

        console.log('req.transcription', req.transcription);
        const userMessage = req.transcription.transcription[0].text;
        console.log('userMessage', userMessage);

        try {
            // const audioPath = req.wavPath;

            // console.log('audioPath', audioPath);
            // // 1. Transcribe
            // const text = await transcribeAudioWhisperNode(audioPath);
            // console.log('Transcribed Audio: ', text);

            // 2. Generate reply
            const chatResponse = await openAi.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: userMessage }]
            });

            const reply = chatResponse.choices[0].message.content;

            console.log('ChatGPT Reply: ', reply);

            // 3. Convert reply to speech
            const audioBuffer = await textToSpeech(reply);

            // Clean up audio file
            // fs.unlink(audioPath, () => { });

            // Send transcription + audio reply
            res.json({ userMessage, reply, audio: audioBuffer.toString('base64') });
        } catch (error) {
            console.log('ERROR', error);
            res.status(500).send('Server Error');
        }
    }
);

export default router;