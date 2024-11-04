import React, { useState, useEffect } from 'react';
import { Search, Star, MessageCircle, ChevronDown, Plus, Settings, ExternalLink, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';


const ChatInterface = () => {
  // States for both global and in-chat search
  const [globalSearchValue, setGlobalSearchValue] = useState('');
  const [chatInputValue, setChatInputValue] = useState('');
  const [showChatSuggestions, setShowChatSuggestions] = useState(false);
  const [showGlobalSearchResults, setShowGlobalSearchResults] = useState(false);
  const [chatSearchResults, setChatSearchResults] = useState([]);
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  
  // State for conversations
  const [conversations, setConversations] = useState({
    starred: [
      { id: 1, title: "Git Rebase Tutorial", date: "Today", preview: "How to perform a git rebase safely..." },
      { id: 2, title: "React Best Practices", date: "Today", preview: "Component design patterns..." },
    ],
    recent: [
      { id: 3, title: "Data Engineer Project", date: "Previous 30 Days", preview: "Project summary and next steps..." },
      { id: 4, title: "AI Hackathon Planning", date: "Previous 30 Days", preview: "Team organization and tasks..." },
      { id: 5, title: "Sensor Function Docs", date: "Previous 30 Days", preview: "Documentation for eye tracking..." },
      { id: 6, title: "Vertex AI Implementation", date: "September", preview: "Adding wait states to workflow..." },
    ]
  });

  // Sample conversation history for search
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
    if (chatInputValue.length > 2) {
      const results = conversationHistory.filter(item => 
        item.question.toLowerCase().includes(chatInputValue.toLowerCase()) ||
        item.question.toLowerCase().includes(chatInputValue.toLowerCase().replace('how to', '').trim())
      );
      setChatSearchResults(results);
      setShowChatSuggestions(results.length > 0);
    } else {
      setShowChatSuggestions(false);
    }
  }, [chatInputValue]);

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

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* New Chat Button */}
        <div className="p-3">
          <Button 
            className="w-full justify-start text-left mb-4 bg-white hover:bg-gray-100 text-gray-700"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" /> New chat
          </Button>
        </div>

        {/* Global Search */}
        <div className="px-3 mb-4 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-10"
              value={globalSearchValue}
              onChange={(e) => setGlobalSearchValue(e.target.value)}
            />
          </div>

          {/* Global Search Results */}
          {showGlobalSearchResults && (
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

        {/* Conversation Lists */}
        <div className="flex-1 overflow-y-auto">
          {/* Starred Conversations */}
          <div className="mb-4">
            <div className="px-3 py-2 text-sm font-medium text-gray-500 flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Starred
            </div>
            {conversations.starred.map(chat => (
              <div 
                key={chat.id}
                className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
              >
                <div className="text-sm font-medium">{chat.title}</div>
                <div className="text-xs text-gray-500 truncate">{chat.preview}</div>
              </div>
            ))}
          </div>

          {/* Recent Conversations */}
          <div>
            <div className="px-3 py-2 text-sm font-medium text-gray-500 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </div>
            {conversations.recent.map(chat => (
              <div 
                key={chat.id}
                className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
              >
                <div className="text-sm font-medium">{chat.title}</div>
                <div className="text-xs text-gray-500 truncate">{chat.preview}</div>
                <div className="text-xs text-gray-400 mt-1">{chat.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="p-3 border-t border-gray-200">
          <Button variant="ghost" className="w-full justify-start text-gray-700">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">ChatGPT</h2>
          <Button variant="ghost" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">How can I help you today?</h2>
              <div className="flex gap-2 justify-center">
                <Button variant="outline">Create image</Button>
                <Button variant="outline">Analyze data</Button>
                <Button variant="outline">Summarize text</Button>
                <Button variant="outline">Get advice</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Input with Search Suggestions */}
        <div className="border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto relative">
            <Input
              placeholder="Message ChatGPT..."
              value={chatInputValue}
              onChange={(e) => setChatInputValue(e.target.value)}
              className="pr-24"
            />
            
            {/* Chat Search Suggestions */}
            {showChatSuggestions && (
              <Card className="absolute bottom-full left-0 right-0 mb-2 max-h-60 overflow-y-auto">
                <div className="p-2">
                  <div className="font-medium text-sm text-gray-500 mb-2">
                    Related questions from your conversations:
                  </div>
                  {chatSearchResults.map((result, index) => (
                    <div 
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                      onClick={() => {
                        setChatInputValue(result.question);
                        setShowChatSuggestions(false);
                      }}
                    >
                      <div className="font-medium">{result.question}</div>
                      <div className="text-sm text-gray-500">{result.conversation}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button size="sm">
                Send
              </Button>
            </div>
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