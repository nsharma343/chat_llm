import React, { useState } from 'react';
import { MessageCircle, Search, GitBranch, ArrowLeft, MoreHorizontal, Split, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';


const BranchDivergenceIndicator = () => {
  const [activeBranch, setActiveBranch] = useState(0);
  const [comparisonBranch, setComparisonBranch] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  
  const branchColors = {
    0: '#3B82F6', // blue
    1: '#10B981', // green
    2: '#F59E0B', // yellow
    3: '#EC4899', // pink
    4: '#8B5CF6', // purple
    5: '#F43F5E', // red
    6: '#06B6D4', // cyan
  };

  const [branches, setBranches] = useState([
    { 
      id: 0, 
      parent: null, 
      messages: [
        { id: 1, content: "How do I perform a git rebase?", sender: "User" },
        { id: 2, content: "To perform a git rebase, follow these steps...", sender: "Assistant" },
        { id: 3, content: "What if I encounter conflicts during rebase?", sender: "User" },
      ] 
    },
    { 
      id: 1, 
      parent: 0, 
      messages: [
        { id: 4, content: "If you encounter conflicts during a rebase, you'll need to resolve them manually...", sender: "Assistant" },
        { id: 5, content: "How do I abort a rebase if needed?", sender: "User" },
      ] 
    },
    { 
      id: 2, 
      parent: 0, 
      messages: [
        { id: 6, content: "Can you explain the difference between merge and rebase?", sender: "User" },
        { id: 7, content: "Certainly! The main difference between merge and rebase is...", sender: "Assistant" },
      ] 
    },
  ]);

  const createNewBranch = (message) => {
    const newBranchId = Math.max(...branches.map(b => b.id)) + 1;
    const newMessageId = Math.max(...branches.flatMap(b => b.messages.map(m => m.id))) + 1;
    
    const newBranch = {
      id: newBranchId,
      parent: activeBranch,
      messages: [
        { id: newMessageId, content: message, sender: "User" },
        { id: newMessageId + 1, content: "This is a dummy answer to your question", sender: "Assistant" }
      ]
    };
    
    setBranches([...branches, newBranch]);
    setActiveBranch(newBranchId);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    if (activeBranch === branches.find(b => b.messages[b.messages.length - 1].sender === "Assistant")?.id) {
      // Create new branch if the current branch ends with an Assistant message
      createNewBranch(inputMessage);
    } else {
      // Add to current branch if it ends with a User message
      const newMessageId = Math.max(...branches.flatMap(b => b.messages.map(m => m.id))) + 1;
      const updatedBranches = branches.map(branch => {
        if (branch.id === activeBranch) {
          return {
            ...branch,
            messages: [
              ...branch.messages,
              { id: newMessageId, content: inputMessage, sender: "User" },
              { id: newMessageId + 1, content: "This is a dummy answer to your question", sender: "Assistant" }
            ]
          };
        }
        return branch;
      });
      setBranches(updatedBranches);
    }
    setInputMessage('');
  };

  const handleCreateBranch = () => {
    if (!inputMessage.trim()) return;
    createNewBranch(inputMessage);
    setInputMessage('');
  };

  const getMessageChain = (branchId) => {
    let allMessages = [];
    let currentBranch = branches.find(b => b.id === branchId);
    
    while (currentBranch) {
      allMessages = [...currentBranch.messages, ...allMessages];
      currentBranch = branches.find(b => b.id === currentBranch.parent);
    }
    return allMessages;
  };

  const renderMessages = (branchId) => {
    const allMessages = getMessageChain(branchId);

    return allMessages.map((msg, index) => (
      <React.Fragment key={msg.id}>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-sm">{msg.sender}</CardTitle>
          </CardHeader>
          <CardContent>{msg.content}</CardContent>
        </Card>
        {branches.some(b => b.parent === branchId && b.messages[0].id === allMessages[index + 1]?.id) && (
          <div className="flex items-center mb-4">
            <hr className="flex-grow border-t border-gray-300" />
            <div className="mx-2 text-gray-500 flex items-center">
              <GitBranch className="h-4 w-4 mr-1" />
              Branch point
            </div>
            <hr className="flex-grow border-t border-gray-300" />
          </div>
        )}
      </React.Fragment>
    ));
  };

  const renderTimelineBranch = () => {
    const timelineHeight = branches.length * 60;
    
    return (
      <svg width="100%" height={timelineHeight} className="mt-4">
        {/* Root branch vertical line */}
        <line 
          x1="50%" 
          y1="0" 
          x2="50%" 
          y2={timelineHeight} 
          stroke="#E5E7EB" 
          strokeWidth="2"
        />
        
        {branches.map((branch, index) => {
          const y = index * 60 + 30;
          const isRoot = branch.id === 0;
          
          if (!isRoot) {
            // Draw horizontal branch lines
            return (
              <g key={branch.id}>
                {/* Horizontal connector */}
                <line 
                  x1="50%" 
                  y1={y} 
                  x2="70%" 
                  y2={y}
                  stroke={branchColors[branch.id]} 
                  strokeWidth="2"
                />
                {/* Branch node */}
                <circle 
                  cx="70%"
                  cy={y}
                  r="6"
                  fill={branchColors[branch.id]}
                  className="cursor-pointer"
                  onClick={() => setActiveBranch(branch.id)}
                />
              </g>
            );
          }
          
          return (
            <circle 
              key={branch.id}
              cx="50%"
              cy="30"
              r="8"
              fill={branchColors[branch.id]}
              className="cursor-pointer"
              onClick={() => setActiveBranch(branch.id)}
            />
          );
        })}
      </svg>
    );
  };

  const toggleComparison = (branchId) => {
    if (comparisonBranch === branchId) {
      setComparisonBranch(null);
    } else {
      setComparisonBranch(branchId);
    }
  };

  const renderBranchSelector = () => {
    return branches.map(branch => (
      <div 
        key={branch.id}
        className={`p-2 mb-1 rounded cursor-pointer flex justify-between items-center
          ${activeBranch === branch.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => setActiveBranch(branch.id)}
      >
        <span>{branch.id === 0 ? 'Root' : `Branch ${branch.id}`}</span>
        {branch.id !== activeBranch && (
          <Button 
            variant="outline" 
            size="sm"
            className="ml-2"
            onClick={(e) => {
              e.stopPropagation();
              toggleComparison(branch.id);
            }}
          >
            <Split className="h-4 w-4" />
          </Button>
        )}
      </div>
    ));
  };

  return (
    <div className="flex w-screen h-screen bg-gray-100">
      {/* Main chat area */}
      <div className={`flex ${comparisonBranch !== null ? 'w-1/2' : 'flex-1'} flex-col border-r`}>
        {/* Branch header */}
        <div className="bg-white p-4 border-b">
          <h2 className="font-bold">
            {activeBranch === 0 ? 'Root' : `Branch ${activeBranch}`}
          </h2>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
            {renderMessages(activeBranch)}
          </div>
        </div>

        {/* Input area */}
        <div className="p-4 bg-white">
          <Input 
            placeholder="Type your message..." 
            className="mb-2"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <div className="flex justify-between">
            <Button variant="ghost" size="icon" className="relative">
              <ArrowLeft className="absolute inset-0 m-auto h-4 w-4 text-gray-400 z-10" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <MessageCircle className="absolute inset-0 m-auto h-4 w-4 text-gray-400 z-10" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleCreateBranch}
              disabled={!inputMessage.trim()}
              className="relative"
            >
              <GitBranch className="absolute inset-0 m-auto h-4 w-4 text-gray-400 z-10" />
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
            >
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* Comparison view */}
      {comparisonBranch !== null && (
        <div className="w-1/2 flex flex-col">
          <div className="bg-white p-4 border-b flex justify-between items-center">
            <h2 className="font-bold">
              {comparisonBranch === 0 ? 'Root' : `Branch ${comparisonBranch}`}
            </h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setComparisonBranch(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {renderMessages(comparisonBranch)}
          </div>
        </div>
      )}

      {/* Conversation graph */}
      <div className="w-64 bg-white p-4">
        <h3 className="font-bold mb-2">Conversation Flow</h3>
        
        {/* Branch selector */}
        <div className="bg-gray-100 p-2 rounded-lg mb-4">
          {renderBranchSelector()}
        </div>

        {/* Visual timeline */}
        <div className="bg-white p-2 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Timeline View</h4>
          {renderTimelineBranch()}
        </div>
      </div>
    </div>
  );
};

export default BranchDivergenceIndicator;