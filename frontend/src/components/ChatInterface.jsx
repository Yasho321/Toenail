import { useState, useEffect, useRef } from 'react';
import { useThumbnailStore } from '../stores/thumbnailStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Download, Loader2, Image as ImageIcon, Bot, User, MessageCircle, X, Paperclip, Plus, Settings } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useChatStore } from '../stores/chatStore';
import ThumbnailFormModal from './ThumbnailFormModal';
import toast from 'react-hot-toast';

export default function ChatInterface({ chatId }) {
  const { getToken } = useAuth();
  const { messages, isLoading, isGenerating, fetchMessages, generateThumbnail, continueChat } = useThumbnailStore();
  const { fetchChats } = useChatStore();
  const { updateTokens, token } = useAuthStore();
  const messagesEndRef = useRef(null);
  
  const [prompt, setPrompt] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedImageForChat, setSelectedImageForChat] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId, getToken);
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadSingle = async (image) => {
    try {
      setIsDownloading(true);
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "thumbnail.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);
      console.error("Error downloading file:", error);
    }
  };

  const handleDownloadAll = async (images) => {
    try {
      const token = await getToken();
      const response = await fetch('https://toenail-6zcz.onrender.com/api/v1/download/download-zip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrls: images }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'thumbnails.zip';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const handleContinueChat = (imageUrl) => {
    setSelectedImageForChat(imageUrl);
  };

  const handleSelectImage = () => {
    setSelectedImageForChat(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    await fetchChats(getToken);
    if (token <= 0) {
      toast.error("Not enough tokens to continue");
      return;
    }
    if (!prompt.trim() || !selectedImageForChat) return;

    setPrompt('');

    const result = await continueChat(chatId, selectedImageForChat, prompt, getToken);
    
    if (result.success) {
      updateTokens();
    }
  };

  const handleFormSubmit = async (formData) => {
    await fetchChats(getToken);

    if (token <= 0) {
      toast.error("Not enough tokens to continue");
      return false;
    }

    const result = await generateThumbnail(chatId, formData, getToken);
    
    if (result) {
      updateTokens();
      toast.success('Thumbnail generated successfully!');
      return true;
    }
    return false;
  };

  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    
    return (
      <div key={index} className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
        {!isUser && (
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-primary" />
          </div>
        )}
        
        <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
          <Card className={`p-4 ${
            isUser 
              ? 'bg-primary text-primary-foreground ml-auto' 
              : 'bg-chat-surface border-chat-border'
          }`}>
            <p className="mb-3 text-sm leading-relaxed">{message.text}</p>
            
            {message.images && message.images.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {message.images.map((image, imgIndex) => (
                    <div key={imgIndex} className="group relative">
                      <img
                        src={image}
                        alt={`Generated thumbnail ${imgIndex + 1}`}
                        className={`w-full aspect-video object-cover rounded-lg transition-all cursor-pointer ${
                          image === selectedImageForChat 
                            ? "border-2 border-primary shadow-lg shadow-primary/40 scale-[1.02]" 
                            : "border border-chat-border hover:border-primary/50"
                        }`}
                        onClick={() => handleContinueChat(image)}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        {image === selectedImageForChat ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectImage();
                            }}
                            className="bg-white/10 hover:bg-white/20 text-white"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleContinueChat(image);
                                }}
                                className="bg-white/10 hover:bg-white/20 text-white"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Select to chat</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/10 hover:bg-white/20 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadSingle(image);
                          }}
                          disabled={isDownloading}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {!isUser && message.images.length > 1 && (
                  <Button
                    onClick={() => handleDownloadAll(message.images)}
                    variant="outline"
                    size="sm"
                    className="w-full border-chat-border hover:bg-chat-surface-hover"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All as ZIP
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
        
        {isUser && (
          <div className="w-8 h-8 bg-chat-user-bg rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Welcome Message */}
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-2xl">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-chat-text mb-4">
              Hello there!
            </h2>
            <p className="text-chat-text-muted mb-8 text-lg">
              How can I help you create amazing thumbnails today?
            </p>
            
            {/* Suggestion buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <Button
                variant="outline"
                className="p-4 h-auto text-left justify-start border-chat-border hover:bg-chat-surface-hover"
                onClick={() => setShowFormModal(true)}
              >
                <Plus className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <div className="font-medium text-chat-text">Create Gaming Thumbnail</div>
                  <div className="text-sm text-chat-text-muted">Generate exciting gaming content</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="p-4 h-auto text-left justify-start border-chat-border hover:bg-chat-surface-hover"
                onClick={() => setShowFormModal(true)}
              >
                <Plus className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <div className="font-medium text-chat-text">Tech Tutorial Thumbnail</div>
                  <div className="text-sm text-chat-text-muted">Professional tech content design</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="p-4 h-auto text-left justify-start border-chat-border hover:bg-chat-surface-hover"
                onClick={() => setShowFormModal(true)}
              >
                <Plus className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <div className="font-medium text-chat-text">Music Video Thumbnail</div>
                  <div className="text-sm text-chat-text-muted">Eye-catching music visuals</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="p-4 h-auto text-left justify-start border-chat-border hover:bg-chat-surface-hover"
                onClick={() => setShowFormModal(true)}
              >
                <Plus className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <div className="font-medium text-chat-text">Vlog Thumbnail</div>
                  <div className="text-sm text-chat-text-muted">Personal and engaging designs</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Messages */
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-0">
            {messages[0]?.messages?.map((message, index) => renderMessage(message, index))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      )}

      {/* Input Area */}
      <div className="border-t border-chat-border bg-chat-surface p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                selectedImageForChat 
                  ? "Continue the conversation about your thumbnail..." 
                  : "Start a new thumbnail project..."
              }
              disabled={isGenerating}
              className="bg-chat-bg border-chat-border text-chat-text placeholder:text-chat-text-muted"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFormModal(true)}
              className="border-chat-border hover:bg-chat-surface-hover"
              title="Upload image and generate thumbnail"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={messages.length === 0 ? () => setShowFormModal(true) : handleSendMessage}
              disabled={messages.length > 0 && (!prompt.trim() || isGenerating || !selectedImageForChat)}
              className="bg-primary hover:bg-primary/90"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        
        {selectedImageForChat && (
          <div className="mt-3 flex items-center gap-2 text-sm text-chat-text-muted">
            <MessageCircle className="w-4 h-4" />
            <span>Chatting about selected image</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectImage}
              className="h-6 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <ThumbnailFormModal
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        isGenerating={isGenerating}
      />
    </div>
  );
}