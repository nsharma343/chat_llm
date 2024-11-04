import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ChatInterface from './components/ChatInterface';
import BranchingChatInterface from './components/BranchingChatInterface';
import FoldingChat from './components/FoldingChat';


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="bg-gray-800 text-white p-4">
          <div className="max-w-7xl px-4 py-3 flex justify-between items-center">
            <div className="font-semibold text-lg pl-0">AI Chat App</div>
            <div className="space-x-10 ml-32">
              <Link to="/" className="hover:text-gray-300">Standard Chat</Link>
              <Link to="/branching" className="hover:text-gray-300">Branching Chat</Link>
              <Link to="/folding" className="hover:text-gray-300">Folding Chat</Link>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<ChatInterface />} />
          <Route path="/branching" element={<BranchingChatInterface />} />
          <Route path="/folding" element={<FoldingChat />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;