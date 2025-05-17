import styles from './Message.module.scss';

export type MessageProps = {
    role: string;
    content: string;
    timestamp: string;
}

export default function Message({
    role,
    content,
    timestamp,
}: MessageProps) {

    return (
        <div className={[
            styles.messageBlock,
            role === 'user' ? styles.userMessage : styles.assistantMessage,
        ].join(' ')}>
            <h2><strong>{role}</strong></h2>
            {content}
        </div>
    );


}
