
import { spawn } from 'child_process';
import express from 'express';
var router = express.Router();
import Multer from 'multer';
import path from 'path';
import sharp from 'sharp';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDestination = path.join(__dirname, '../uploads');

const filename_part = `user-image-${Date.now()}.png`;

// Disk storage
const storage = Multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDestination);
    },
    filename: function (req, file, cb) {
        const filename = filename_part;
        cb(null, filename);
    },
});

const upload = Multer({
    dest: './uploads',
    storage: storage
});

router.post('/upload-image',
    upload.single('image'),
    async (req, res, next) => {
        // Handle image upload here
        console.log('Received audio file:', req.file.path);

        console.log('PRE-PROCESSING IMAGE');
        const resizedFilePath = path.join(uploadDestination, `resized-${filename_part}`);

        await sharp(req.file.path)
            .resize(28, 28)
            .grayscale()
            .toFile(resizedFilePath)

        console.log('PROCESSING');

        // const py = spawn('/Users/bradyworks/.venv/bin/python3', ['--version']);
        const py = spawn('/Users/bradyworks/.venv/bin/python3', [
            '/Users/bradyworks/Development/ML_practice/number-recognizer.py',
            resizedFilePath
        ]);

        let result = '';
        py.stdout.on('data', (data) => {
            console.log('got data:', data.toString());
            result += data.toString();
        });

        py.stderr.on('data', (data) => {
            console.error(`stderr: ${data.toString()}`);
        });

        py.on('close', (code) => {
            if (code !== 0) {
                console.log('code', code);
                console.error(`Python script exited with code ${code}`);
                return res.status(500).json({ error: 'Failed to process audio file' });
            }

            console.log('File processed successfully');

            console.log('result', result);
            console.log('result.prediction', result.prediction);
            const parsedResult = JSON.parse(result);
            console.log('parsedResult', parsedResult);
            // console.log('parsedResult.prediction', parsedResult.prediction);

            // const jsonResult = result.split('########################################\n\n').slice(-1)[0];
            // const parsedResult = JSON.parse(jsonResult);
            // console.log('JSON Result:', jsonResult);

            res.json({
                message: 'File uploaded and processed successfully',
                result: {
                    prediction: parsedResult.prediction,
                },
            });
        });

        // res.json({ message: 'Audio file uploaded successfully', file: req.file });
    }
);

export default router;
