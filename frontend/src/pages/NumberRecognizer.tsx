

import Layout from '@/components/Layout';
import styles from './NumberRecognizer.module.scss';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@mantine/core';

type Result = {
    value: number;
    number: number; 
}

export function NumberRecognizer() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ isDrawing, setIsDrawing ] = useState(false);
    const [ lastPosition, setLastPosition ] = useState({ x: 0, y: 0 });
    // ts-ignore-next-line

    const [ result, setResult ] = useState<Result>({ value: 0, number: -1 });

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = 400;
        canvas.height = 400;

        // Set initial styles
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
    }, []);

    const getMousePosition = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        return {
            x: event.clientX - (rect?.left || 0),
            y: event.clientY - (rect?.top || 0)
        };
    }
     
    const onMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        setLastPosition(getMousePosition(event));
        setIsDrawing(true);
    }

    const onMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current!.getContext('2d')!;
        const pos = getMousePosition(event);
        ctx.beginPath();
        ctx.moveTo(lastPosition.x, lastPosition.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        setLastPosition(pos);
    }

    const onClickClearButton = () => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setIsDrawing(false);
        setLastPosition({ x: 0, y: 0 });
    }

    const onMouseUp = () => setIsDrawing(false);
    const onMouseLeave = () => setIsDrawing(false);

    const onClickSubmitButton = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        try {

            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error('Failed to convert canvas to blob');
                    return;
                }
                const formData = new FormData();
                formData.append('image', blob, 'drawing.png');

                fetch('/number-recognizer/upload-image', {
                    method: 'POST',
                    body: formData
                }).then(response => response.json())
                .then(data => {
                    console.log('HERE');
                    console.log(data);
                    console.log('data.result', data.result);

                    const predictions = data.result.prediction[0];
                    const maxLikelyhood = predictions
                        .map((value: number, index: number) => ({
                            value: value,
                            number: index,
                        }))
                        .sort((a: any, b: any) => b.value - a.value)
                        [0];

                    setResult(maxLikelyhood);


                })
                .catch(error => console.error('Error:', error));
            });
        } catch (error) {
            console.error('Error :', error);
        }
    }

    return (
        <Layout>
            <div className={styles.page}>
                <canvas
                    className={styles.drawingInput}
                    ref={canvasRef}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseLeave}
                />

                <div className={styles.instructions}>
                    <h2>Draw a single digit number</h2>
                    <p>Use your mouse to draw a number on the canvas above.</p>
                    <p>Once you're done, click Submit to see if the model can identify which number is it.</p>
                </div>

                <div className={styles.actions}>
                    <Button
                        onClick={onClickSubmitButton}
                    >
                        Submit
                    </Button>
                    <Button
                        color="red"
                        onClick={onClickClearButton}
                    >
                        Clear
                    </Button>
                </div>

                <div className={styles.resultsOutput}>

                    <h2>Results:</h2> 
                    {result.number !== -1 ? (
                        <p>
                            I think this number is:
                            <span className={styles.resultNumber}>
                                {result.number}
                            </span>
                            with a confidence of
                            <span className={styles.resultConfidence}>
                                {result.value}
                            </span>
                        </p>
                    ) : ''}
                </div>
            </div>
        </Layout>
    )
}
