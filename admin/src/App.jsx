import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import PageList from './components/PageList';
import Editor from './components/Editor';
import MenuManager from './components/MenuManager';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
        <Sidebar aria-label="Main Navigation" />
        <div className="flex-1 ml-64 min-h-screen">
          <Routes>
            <Route path="/" element={<PageList />} />
            <Route path="/editor/new" element={<Editor />} />
            <Route path="/editor/:id" element={<Editor />} />
            <Route path="/menus" element={<MenuManager />} />
          </Routes>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
