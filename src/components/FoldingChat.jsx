import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, X, Check } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

const MessageComponent = ({ message, onCreateSection }) => (
    <div className="pl-4 mb-4">
      {message.sender === 'User' && !message.hasSection && (
        <div className="mb-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onCreateSection(message.id)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Section Above
          </Button>
        </div>
      )}
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium">{message.sender}</span>
      </div>
      <div className="text-gray-700">{message.content}</div>
    </div>
  );
  
  const SectionComponent = ({ section, onToggle, isSelected, onSelect }) => (
    <div 
      className={`mb-4 border-l-2 ${isSelected ? 'border-green-500' : 'border-blue-500'}`}
      onClick={() => onSelect(section.id)}
    >
      <div 
        className={`flex items-center p-2 cursor-pointer ${isSelected ? 'bg-green-50' : 'bg-gray-50'} hover:bg-gray-100`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(section.id);
        }}
      >
        {section.isExpanded ? 
          <ChevronDown className="h-4 w-4 mr-2" /> : 
          <ChevronRight className="h-4 w-4 mr-2" />
        }
        <h3 className="font-medium">{section.title}</h3>
      </div>
    </div>
  );
  
  const ChatInterface = () => {
    // Sample messages with sections
    const [messages, setMessages] = useState([
      { id: 1, type: 'section', title: 'Git Basics', isExpanded: true },
      { id: 2, type: 'message', sender: 'User', content: 'How do I perform a git rebase?', hasSection: true },
      { id: 3, type: 'message', sender: 'Assistant', content: 'To perform a git rebase, follow these steps...' },
      { id: 5, type: 'message', sender: 'User', content: 'What if I encounter conflicts during rebase?', hasSection: false },
      { id: 6, type: 'message', sender: 'Assistant', content: 'If you encounter conflicts, here is how to resolve them...' },
      { id: 7, type: 'message', sender: 'User', content: 'How do I use git cherry-pick?', hasSection: false },
      { id: 8, type: 'message', sender: 'Assistant', content: 'Git cherry-pick allows you to apply specific commits...' },
      { id: 9, type: 'message', sender: 'User', content: 'What is the difference between merge and rebase?', hasSection: false },
      { id: 10, type: 'message', sender: 'Assistant', content: 'The main difference between merge and rebase is...' }
    ]);
  
    const [showSplitView, setShowSplitView] = useState(false);
    const [selectedSections, setSelectedSections] = useState([]);
    const [isAddingSection, setIsAddingSection] = useState(null);
    const [newSectionTitle, setNewSectionTitle] = useState('');
  
    const addSection = (messageId) => {
      setIsAddingSection(messageId);
    };
  
    const confirmAddSection = () => {
      if (newSectionTitle.trim()) {
        const messageIndex = messages.findIndex(m => m.id === isAddingSection);
        const newMessages = [...messages];
        newMessages.splice(messageIndex, 0, {
          id: Date.now(),
          type: 'section',
          title: newSectionTitle,
          isExpanded: true
        });
        // Mark the message as having a section
        newMessages[messageIndex + 1] = {
          ...newMessages[messageIndex + 1],
          hasSection: true
        };
        setMessages(newMessages);
        setIsAddingSection(null);
        setNewSectionTitle('');
      }
    };
  
    const toggleSection = (sectionId) => {
      setMessages(messages.map(m => 
        m.id === sectionId ? {...m, isExpanded: !m.isExpanded} : m
      ));
    };
  
    const toggleSectionSelection = (sectionId) => {
      setSelectedSections(prev => {
        if (prev.includes(sectionId)) {
          return prev.filter(id => id !== sectionId);
        }
        if (prev.length < 2) {
          return [...prev, sectionId];
        }
        return [prev[1], sectionId];
      });
    };
  
    const getSectionContent = (sectionId) => {
      const section = messages.find(m => m.id === sectionId);
      const sectionStart = messages.findIndex(m => m.id === sectionId);
      const sectionEnd = messages.findIndex((m, i) => 
        i > sectionStart && m.type === 'section'
      );
      return {
        title: section.title,
        messages: messages.slice(
          sectionStart + 1,
          sectionEnd === -1 ? undefined : sectionEnd
        )
      };
    };
  
    return (
      <div className="h-screen  w-screen bg-white flex flex-col">
        <div className="border-b p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Chat</h1>
          <Button 
            variant="outline"
            onClick={() => {
              setShowSplitView(!showSplitView);
              if (!showSplitView) {
                setSelectedSections([]); // Clear selections when entering split view
              }
            }}
          >
            {showSplitView ? "Exit Split View" : "Split View"}
          </Button>
        </div>
  
        <div className="flex-1 overflow-hidden">
          {showSplitView ? (
            <div className="h-full flex flex-col">
              {/* Section Selection Area */}
              {selectedSections.length < 2 && (
                <div className="p-4 bg-blue-50">
                  <h2 className="text-sm font-medium text-blue-700 mb-2">
                    Select {2 - selectedSections.length} section{selectedSections.length === 0 ? 's' : ''} to compare
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {messages
                      .filter(m => m.type === 'section')
                      .map(section => (
                        <Button
                          key={section.id}
                          variant={selectedSections.includes(section.id) ? "default" : "outline"}
                          onClick={() => toggleSectionSelection(section.id)}
                          className="text-sm"
                        >
                          {section.title}
                        </Button>
                      ))}
                  </div>
                </div>
              )}
              
              {/* Split View Area */}
              {selectedSections.length === 2 && (
                <div className="flex-1 flex gap-4 p-4">
                  {selectedSections.map(sectionId => {
                    const { title, messages: sectionMessages } = getSectionContent(sectionId);
                    return (
                      <Card key={sectionId} className="flex-1 overflow-y-auto">
                        <div className="sticky top-0 bg-white p-4 border-b">
                          <h3 className="font-medium">{title}</h3>
                        </div>
                        <div className="p-4">
                          {sectionMessages.map(message => (
                            <MessageComponent 
                              key={message.id}
                              message={message}
                              onCreateSection={addSection}
                            />
                          ))}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-4">
              {messages.map((item) => (
                <div key={item.id}>
                  {item.type === 'section' ? (
                    <SectionComponent 
                      section={item}
                      onToggle={toggleSection}
                      isSelected={false}
                      onSelect={() => {}}
                    />
                  ) : (
                    <>
                      {isAddingSection === item.id ? (
                        <div className="pl-4 mb-4 flex items-center gap-2">
                          <Input
                            placeholder="Section title..."
                            value={newSectionTitle}
                            onChange={(e) => setNewSectionTitle(e.target.value)}
                            className="flex-1"
                            autoFocus
                          />
                          <Button size="sm" onClick={confirmAddSection}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setIsAddingSection(null);
                              setNewSectionTitle('');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <MessageComponent 
                          message={item}
                          onCreateSection={addSection}
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default ChatInterface;