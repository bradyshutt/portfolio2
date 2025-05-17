
import { OpenAI } from 'openai';
// import { whisper } from 'whisper-node';
import { nodewhisper } from 'nodejs-whisper';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const __dirname = import.meta.dirname;


export default async function whisperTranscribeAudio(req, res, next) {

    const audioPath = req.wavPath;
    console.log('audioPath', audioPath);
    console.log('__dirname', __dirname);

    const result = await nodewhisper(audioPath, {
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

    const fileName = path.basename(audioPath);
    const jsonPath = path.join(__dirname, '../../uploads', `${fileName}.json`);
    console.log('jsonPath', jsonPath);

    if (!fs.existsSync(jsonPath)) {
        console.log('Transcription JSON file not found:', jsonPath);
        throw new Error('Transcription JSON not found');
    }


    console.log('Now reading file');
    // Read the transcription JSON file
    fs.readFile(jsonPath, 'utf8', (error, data) => {
        console.log('File read, ', data);
        if (error) {
            console.error('Error reading transcription file:', error);
            return res.status(500).json({ message: 'Failed to read transcription file', error });
        }

        try {
            const transcription = JSON.parse(data);
            console.log('Transcription:', transcription);
            // Add the transcription to the request object
            req.transcription = transcription;
            next();
        } catch (parseError) {
            console.error('Error parsing transcription JSON:', parseError);
            return res.status(500).json({ error: 'Failed to parse transcription JSON', parseError });
        }
    });
}