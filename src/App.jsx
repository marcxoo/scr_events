import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EventProvider } from './context/EventContext';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <EventProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </EventProvider>
  );
}

export default App;
