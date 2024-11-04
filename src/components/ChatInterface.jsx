import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Star, 
  ChevronDown, 
  Plus, 
  Settings, 
  ExternalLink, 
  X,
  MessageCircle
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';


const ChatInterface = () => {
  // States for conversations and chat
  const [conversations] = useState({
    starred: [
      { id: 1, title: "Git Rebase Tutorial", date: "Today", preview: "How to perform a git rebase safely..." },
      { id: 2, title: "React Component Design", date: "Today", preview: "Component design patterns and best practices..." }
    ],
    recent: [
      { id: 3, title: "Data Engineer Project Summary", date: "Previous 30 Days", preview: "Project summary and next steps for the data pipeline..." },
      { id: 4, title: "AI Hackathon Team Names", date: "Previous 30 Days", preview: "Team organization and project ideas..." },
      { id: 5, title: "Human Eye Sensor Function", date: "Previous 30 Days", preview: "Documentation for eye tracking implementation..." },
      { id: 6, title: "Adding Wait in Vertex AI", date: "September", preview: "Adding wait states to workflow implementation..." }
    ]
  });

  // Search and suggestion states
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [globalSearchValue, setGlobalSearchValue] = useState('');
  const [showGlobalSearchResults, setShowGlobalSearchResults] = useState(false);
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  const [currentChat] = useState({
    id: 1,
    messages: [
      { id: 1, role: 'user', content: 'How do I perform a git rebase?' },
      { id: 2, role: 'assistant', content: 'To perform a git rebase, you need to follow these steps: First, make sure your local branch is up to date. Then use the git rebase command followed by the branch name.' },
      { id: 3, role: 'user', content: 'What if I encounter conflicts during rebase?' },
      { id: 4, role: 'assistant', content: 'When conflicts occur during a rebase, Git will pause the process. You will need to resolve each conflict manually by editing the files.' }
    ]
  });
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showChatSuggestions, setShowChatSuggestions] = useState(false);
  const [chatSuggestions, setChatSuggestions] = useState([]);

  // Sample conversation history for suggestions
  const conversationHistory = [
    { question: "How do I perform a git rebase?", conversation: "Git Rebase Tutorial" },
    { question: "How to resolve conflicts during a git rebase?", conversation: "Git Rebase Tutorial" },
    { question: "What is git reset and how to use it?", conversation: "Git Commands Guide" },
    { question: "How to undo git rebase?", conversation: "Git Troubleshooting" },
    { question: "Git revert vs reset - what's the difference?", conversation: "Git Commands Guide" },
    { question: "How to use git cherry-pick?", conversation: "Git Advanced Features" }
  ];

  // Effect for chat input suggestions
  useEffect(() => {
    if (inputValue.length > 2) {
      const results = conversationHistory.filter(item => 
        item.question.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.question.toLowerCase().includes(inputValue.toLowerCase().replace('how to', '').trim())
      );
      setChatSuggestions(results);
      setShowChatSuggestions(results.length > 0);
    } else {
      setShowChatSuggestions(false);
    }
  }, [inputValue]);

  // Effect for global search
  useEffect(() => {
    if (globalSearchValue.length > 2) {
      const results = [
        ...conversations.starred.filter(conv => 
          conv.title.toLowerCase().includes(globalSearchValue.toLowerCase()) ||
          conv.preview.toLowerCase().includes(globalSearchValue.toLowerCase())
        ),
        ...conversations.recent.filter(conv => 
          conv.title.toLowerCase().includes(globalSearchValue.toLowerCase()) ||
          conv.preview.toLowerCase().includes(globalSearchValue.toLowerCase())
        )
      ];
      setGlobalSearchResults(results);
      setShowGlobalSearchResults(true);
    } else {
      setShowGlobalSearchResults(false);
    }
  }, [globalSearchValue]);

  const handleChatSearch = (query) => {
    setChatSearchQuery(query);
    if (query.trim()) {
      const results = currentChat.messages.filter(msg => 
        msg.content.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setCurrentResultIndex(0);
    } else {
      setSearchResults([]);
    }
  };

  const handlePrevResult = () => {
    setCurrentResultIndex((prev) => 
      (prev - 1 + searchResults.length) % searchResults.length
    );
  };

  const handleNextResult = () => {
    setCurrentResultIndex((prev) => 
      (prev + 1) % searchResults.length
    );
  };

  const clearSearch = () => {
    setShowChatSearch(false);
    setChatSearchQuery('');
    setSearchResults([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.question);
    setShowChatSuggestions(false);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-3">
          <Button 
            className="w-full justify-start text-left mb-4 bg-white hover:bg-gray-100 text-gray-700"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" /> New chat
          </Button>
        </div>

        <div className="px-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-10"
              value={globalSearchValue}
              onChange={(e) => setGlobalSearchValue(e.target.value)}
            />
            
            {/* Global Search Results */}
            {showGlobalSearchResults && globalSearchResults.length > 0 && (
              <Card className="absolute w-full z-50 mt-1 max-h-96 overflow-y-auto">
                <div className="p-2">
                  {globalSearchResults.map((result) => (
                    <div 
                      key={result.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                    >
                      <div className="font-medium text-sm">{result.title}</div>
                      <div className="text-xs text-gray-500">{result.preview}</div>
                      <div className="text-xs text-gray-400 mt-1">{result.date}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="mb-4">
            <div className="px-3 py-2 text-sm font-medium text-gray-500">Starred</div>
            {conversations.starred.map(chat => (
              <div 
                key={chat.id}
                className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
              >
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-400" />
                  <span className="text-sm font-medium">{chat.title}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 ml-6 truncate">
                  {chat.preview}
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="px-3 py-2 text-sm font-medium text-gray-500">Recent</div>
            {conversations.recent.map(chat => (
              <div 
                key={chat.id}
                className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
              >
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm font-medium">{chat.title}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 ml-6 truncate">
                  {chat.preview}
                </div>
                <div className="text-xs text-gray-400 mt-1 ml-6">
                  {chat.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-gray-200">
          <Button variant="ghost" className="w-full justify-start text-gray-700">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">ChatGPT</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowChatSearch(!showChatSearch)}
            >
              <Search className="h-4 w-4 text-black" />
            </Button>
            <Button variant="ghost" size="icon">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showChatSearch && (
          <div className="border-b border-gray-200 p-2 bg-gray-50">
            <div className="max-w-3xl mx-auto flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search in conversation..."
                  value={chatSearchQuery}
                  onChange={(e) => handleChatSearch(e.target.value)}
                  className="pl-10 pr-20"
                />
                {searchResults.length > 0 && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-sm text-gray-500">
                    <span>{currentResultIndex + 1} of {searchResults.length}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handlePrevResult}
                    >
                      ↑
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleNextResult}
                    >
                      ↓
                    </Button>
                  </div>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          {currentChat.messages.map((message) => (
            <div 
              key={message.id}
              className={`mb-4 p-4 rounded ${
                searchResults.includes(message) 
                  ? 'bg-yellow-50' 
                  : message.role === 'assistant' 
                    ? 'bg-gray-50' 
                    : 'bg-white'
              } ${
                searchResults[currentResultIndex]?.id === message.id 
                  ? 'ring-2 ring-blue-500' 
                  : ''
              }`}
            >
              <div className="font-medium mb-2">
                {message.role === 'assistant' ? 'Assistant' : 'You'}
              </div>
              <div>{message.content}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto relative">
            <Input
              placeholder="Message ChatGPT..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pr-24"
            />
            
            {/* Chat Suggestions */}
            {showChatSuggestions && (
              <Card className="absolute bottom-full left-0 right-0 mb-2 max-h-60 overflow-y-auto">
                <div className="p-2">
                  <div className="font-medium text-sm text-gray-500 mb-2">
                    Related questions from your conversations:
                  </div>
                  {chatSuggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="font-medium text-sm">{suggestion.question}</div>
                      <div className="text-xs text-gray-500">{suggestion.conversation}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              size="sm"
            >
              Send
            </Button>
          </div>
          <div className="text-center text-xs text-gray-500 mt-2">
            ChatGPT can make mistakes. Check important info.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;