
import { BehaviorSubject } from 'rxjs'

class RecordingService {

    private stream: MediaStream | null = null;
    private audioChunks: Array<Blob> = [];
    private mediaRecorder: MediaRecorder | null = null;

    public get isInitialized() { return this.stream !== null; };


    public isRecording$ = new BehaviorSubject<boolean>(false);
    // private _isRecording: boolean = false;
    public get isRecording() { 
        return this.isRecording$.value;
    }
    private set isRecording(value: boolean) { 
        this.isRecording$.next(value);
        // this._isRecording = value;
        // this.notify()
    }
    
    public constructor() {}

    // Prompts the user for permission to use the microphone
    // and initializes the MediaRecorder
    public async init() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('getUserMedia is not supported in this browser.');
        }
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(this.stream);
    }

    public async startRecording() {
        return new Promise<Array<Blob>>((resolve) => {
            this.audioChunks = [];
            this.isRecording$.next(true);

            if (!this.mediaRecorder) {
                throw new Error('MediaRecorder is not initialized. Call init() first.');
            }

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                    // socket.send(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                resolve(this.audioChunks);
            }

            this.mediaRecorder.start();
            // mediaRecorderRef.current.start(250); // Send data every 250ms
        });
    };

    public stopRecording() {
        console.log('STOP RECORDING');
        this.mediaRecorder!.stop();
        this.isRecording$.next(false);
    };
    
}

const instance = new RecordingService();
export default instance;
