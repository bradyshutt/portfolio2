


export function chatAudio(audioChunks: Blob[], messages: any[]) {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    console.log('messages', messages);

    return fetch('/api/chat-audio', {
        method: 'POST',
        body: formData
    });
}



export function chatText(text: string) {
    // const formData = new FormData();
    // formData.append('text', text);


    return fetch('/api/text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: text,
        }),
    });
}