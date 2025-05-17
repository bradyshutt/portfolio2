import { Button } from '@mantine/core';
import Layout from '../Layout';
import { useLayout } from '../LayoutContext';
import styles from './LandingPage.module.css';

export default function Home() {
    const { isSidebarOpen, toggleSidebar } = useLayout();

    function handleClick() {
        toggleSidebar();
    }

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