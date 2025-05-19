// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import ChatPage from './components/ChatPage/ChatPage';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import LandingPage from './components/LandingPage/LandingPage';
import { LayoutProvider } from './components/LayoutContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MantineProvider>
            <LayoutProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/convo-bot" element={<ChatPage />} />
                    </Routes>
                </BrowserRouter>
            </LayoutProvider>
        </MantineProvider>
    </React.StrictMode>
);
