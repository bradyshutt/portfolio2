
import { useDisclosure } from '@mantine/hooks';
import { createContext, useContext } from 'react';

const LayoutContext = createContext({
    isSidebarOpen: false,
    openSidebar: () => { },
    closeSidebar: () => { },
    toggleSidebar: () => { },
});

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, { open, close, toggle }] = useDisclosure(false);

    const providerValue = {
        isSidebarOpen: isOpen,
        openSidebar: open,
        closeSidebar: close,
        toggleSidebar: () => {
            console.log('Toggle sidebar');
            toggle();
        }
    }

    return (
        <LayoutContext.Provider value={providerValue}>
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    return useContext(LayoutContext);
}
