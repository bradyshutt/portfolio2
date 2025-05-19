import { OpenAI } from 'openai';
// import { whisper } from 'whisper-node';
import { nodewhisper } from 'nodejs-whisper';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function transcribeAudioWhisperNode(filePath) {
    // TODO: Error if missing bin
    // const modelPath = path.resolve('./models/ggml-small.en.bin'); // or .bin for other models

    const result = await nodewhisper(filePath, {
        modelName: 'small.en',
        withCude: true, // Use GPU if available
        whisperOptions: {
            outputInJson: true,
            outputInText: true,
            outputInSrt: false,
            outputInVtt: false,
            wordTimestamps: false,
        },
    });

    console.log('result', result);
    return result;
}


export async function transcribeAudioOpenAi(filePath) {
    const audioStream = fs.createReadStream(filePath);
    console.log('fetching transcription for filePath', filePath);

    const transcription = await openAi.audio.transcriptions.create({
        model: 'whisper-1',
        file: audioStream,
    });

    return transcription.text;
};

export async function transcribeAudio(filePath) {
    // return transcribeAudioWhisperNode(filePath);
    return await transcribeAudioOpenAi(filePath);
}