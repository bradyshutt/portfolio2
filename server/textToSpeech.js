import { OpenAI } from 'openai';

import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function textToSpeech(text) {
    const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        // voice: 'shimmer', // Other options: alloy, echo, fable, onyx
        voice: 'sage', // Other options: alloy, echo, fable, onyx
        input: text,
        speed: 1.2,
        instructions: 'Make it sound like a human',
    });
    return Buffer.from(await mp3.arrayBuffer());
};
