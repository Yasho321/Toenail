import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Image as ImageIcon } from 'lucide-react';
import { useThumbnailStore } from '../stores/thumbnailStore';
import { useAuthStore } from '../stores/authStore';
import { useAuth } from '@clerk/clerk-react';
export default function ContinueChatModal({ isOpen, onClose, chatId, selectedImage }) {
    const {getToken} = useAuth();
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const { continueChat, isGenerating } = useThumbnailStore();
  const { updateTokens } = useAuthStore();

  const handleSendMessage = async () => {
    if (!prompt.trim() || !selectedImage) return;

    const userMessage = {
      role: 'user',
      text: prompt,
      images: [selectedImage],
      createdAt: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setPrompt('');

    const result = await continueChat(chatId, selectedImage, prompt,getToken);
    
    if (result.success) {
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        text: result.response.text,
        images: result.response.images || [],
        createdAt: new Date().toISOString()
      }]);
      updateTokens();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Continue Chat</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex gap-4">
          {/* Selected Image */}
          <div className="w-1/3">
            <div className="border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Selected Image
              </h3>
              <img
                src={selectedImage}
                alt="Selected thumbnail"
                className="w-full rounded-lg"
              />
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 border border-border rounded-lg p-4 mb-4">
              <div className="space-y-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p>Start a conversation about your selected thumbnail!</p>
                  </div>
                ) : (
                  chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        {message.images && message.images.length > 0 && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {message.images.map((img, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={img}
                                alt={`Generated thumbnail ${imgIndex + 1}`}
                                className="w-full rounded border"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Continue the conversation about your thumbnail..."
                disabled={isGenerating}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!prompt.trim() || isGenerating}
                variant="hero"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}