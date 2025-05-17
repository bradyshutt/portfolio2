
import { useDisclosure } from '@mantine/hooks';
import Navbar from './Navbar';
import { createContext, useContext } from 'react';
import { Drawer } from '@mantine/core';
import { useLayout } from './LayoutContext';
import { AppDrawer } from './AppDrawer/AppDrawer';
import styles from './Layout.module.scss';

export default function Layout({ children }: { children: React.ReactNode }) {

    const { isSidebarOpen, toggleSidebar } = useLayout();

    return (
        <main className={styles.layout}>
            <Navbar />

            <div className={styles.content}>
                {children}
            </div>


            <Drawer
                opened={isSidebarOpen}
                onClose={toggleSidebar}
                padding="md"
                radius="md"
                size="sm"
            >
                <AppDrawer />
            </Drawer>
        </main>
    )
}