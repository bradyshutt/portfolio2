import Layout from '../Layout';
import styles from './LandingPage.module.css';

export default function Home() {
    return (
        <Layout>
            <h1 className={styles.title}>
                Welcome
            </h1>
            <div className={styles.angledDivContainer}>
                <div className={styles.angledDiv} />
            </div>
        </Layout>
    );
}