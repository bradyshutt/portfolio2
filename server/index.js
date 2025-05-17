// import Express from 'express';
// import Multer from 'multer';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { OpenAI } from 'openai';

// import { textToSpeech } from './textToSpeech.js';
// import { transcribeAudio, transcribeAudioWhisperNode } from './speechToText.js';

// import dotenv from 'dotenv';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config();

// const app = Express();
// const PORT = 3002;

// const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


// export default function setupWebServer(app) {

//     app.use(Express.static(path.join(__dirname, '../frontend/dist')));

//     const upload = Multer({
//         storage: Multer.diskStorage({
//             destination: './uploads',
//             filename: (req, file, cb) => {
//                 const ext = path.extname(file.originalname);
//                 console.log('EXT', ext);
//                 cb(null, `audio${ext}`);
//             }
//         }),
//     })

//     app.post('/api/chat', upload.single('audio'), async (req, res) => {
//         console.log('ReCeIveD AuDiO FILe:', req.file);
//         try {
//             const audioPath = req.file.path;

//             // 1. Transcribe
//             const text = await transcribeAudioWhisperNode(audioPath);
//             console.log('Transcribed Audio: ', text);

//             // 2. Generate reply
//             const chatResponse = await openAi.chat.completions.create({
//                 model: 'gpt-4',
//                 messages: [{ role: 'user', content: text }]
//             });

//             const reply = chatResponse.choices[0].message.content;

//             console.log('ChatGPT Reply: ', reply);

//             // 3. Convert reply to speech
//             const audioBuffer = await textToSpeech(reply);

//             // Clean up audio file
//             fs.unlink(audioPath, () => { });

//             // Send transcription + audio reply
//             res.json({ text, reply, audio: audioBuffer.toString('base64') });
//         } catch (error) {
//             console.error(error);
//             res.status(500).send('Server Error');
//         }
//     });



//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// }