import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { fileURLToPath } from 'url';
import { PassThrough, Writable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default function convertWebmToWav(req, res, next) {
    if (!req.file || req.file.mimetype !== 'audio/webm') {
        return res.status(400).json({ error: 'Expected audio/webm file' });
    }

    // Create a unique filename for the output WAV
    const baseName = path.parse(req.file.originalname).name;
    const timestamp = Date.now();

    const wavPath = path.join(__dirname, '../../uploads', `${baseName}-${timestamp}.wav`);

    // Convert the uploaded file buffer into a readable stream
    // Why: ffmpeg needs a readable stream to process the audio
    const inputStream = new PassThrough();
    inputStream.end(req.file.buffer);

    // Capture the output of ffmpeg as a buffer
    const outputChunks = [];

    // Writable stream to receive ffmpeg's output
    const outputStream = new Writable({
        write(chunk, encoding, callback) {
            outputChunks.push(chunk);
            callback(); // Signals that the chunk has been processed
        },
    });

    console.log('setting up write file stream');
    const fileWriteStream = fs.createWriteStream(wavPath);

    ffmpeg(inputStream)
        .audioFrequency(16000) // Downsample to 16kHz, which Whisper needs
        .audioChannels(1) // Convert to mono
        .format('wav')
        .on('error', (err) => {
            console.log('FFmpeg error:', err);
            return res.status(500).json({
                error: 'Audio conversion failed',
                message: err
            });
        })
        .on('end', () => {
            // Add the converted audio buffer to the request object
            console.log('hi');
            const wavBuffer = Buffer.concat(outputChunks);

            console.log('on end');
            // Save the buffer to a .wav file
            // fs.writeFile(wavPath, wavBuffer, (err) => {
            //     if (err) {
            //         console.error('Error writing WAV file:', err);
            //         return res.status(500).json({ error: 'Failed to save WAV file', err });
            //     }
            //     console.log('WAV file saved:', wavPath);
            // });

            req.wavAudio = wavBuffer;
            req.wavPath = wavPath;
            next();
        })
        // .pipe(outputStream);     // Also collect in memory
        .pipe(fileWriteStream);
}
