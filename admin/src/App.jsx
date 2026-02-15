import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import PageList from './components/PageList';
import Editor from './components/Editor';
import MenuManager from './components/MenuManager';
import UISettings from './components/UISettings';

const Layout = ({ children }) => {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/editor');

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {!isEditor && <Sidebar aria-label="Main Navigation" />}
      <div className={`flex-1 min-h-screen ${!isEditor ? 'ml-64' : ''}`}>
        {children}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<PageList />} />
          <Route path="/editor/new" element={<Editor />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/menus" element={<MenuManager />} />
          <Route path="/settings" element={<UISettings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
