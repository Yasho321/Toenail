import { useState, useEffect, useRef } from 'react';
import { useThumbnailStore } from '../stores/thumbnailStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Send, Upload, Download, Loader2, Image as ImageIcon, Bot, User, MessageCircle, X } from 'lucide-react';
import ContinueChatModal from './ContinueChatModal';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import FileInput from './ui/file-input';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export default function ChatInterface({ chatId }) {
  const {getToken} = useAuth();
  const { messages, isLoading, isGenerating, fetchMessages, generateThumbnail ,continueChat} = useThumbnailStore();
  const { updateTokens } = useAuthStore();
  const messagesEndRef = useRef(null);
  
  
  const [formData, setFormData] = useState({
    prompt: '',
    genre: '',
    mood: '',
    title: '',
    resolution: '1280 x 720',
    file: null
  });

  const [previewUrl, setPreviewUrl] = useState(null);
    const [continueChatOpen, setContinueChatOpen] = useState(false);
  const [selectedImageForChat, setSelectedImageForChat] = useState(null);

  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId,getToken);
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPG, PNG, WEBP)');
        return;
      }

      setFormData({ ...formData, file });
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (!formData.file) {
      toast.error('Please upload an image');
      return;
    }

    const submitData = new FormData();
    submitData.append('prompt', formData.prompt);
    submitData.append('genre', formData.genre);
    submitData.append('mood', formData.mood);
    submitData.append('title', formData.title);
    submitData.append('resolution', formData.resolution);
    submitData.append('file', formData.file);

    const result = await generateThumbnail(chatId, submitData, getToken);
    
    if (result) {
      updateTokens(); // Deduct one token
      setFormData({
        prompt: '',
        genre: '',
        mood: '',
        title: '',
        resolution: '1280 x 720',
        file: null
      });
      setPreviewUrl(null);
      toast.success('Thumbnail generated successfully!');
    }
  };

  const [prompt , setPrompt]= useState("");

  const[isDownloading , setIsDownloading]=useState(false);

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

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      setIsDownloading(false)
    } catch (error) {
      setIsDownloading(false)
      console.error("Error downloading file:", error);
    }
  };

  const handleDownloadAll = async (images) => {
    try {
      const token =await getToken();
      const response = await fetch('https://toenail.onrender.com/api/v1/download/download-zip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Attach token
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
    setContinueChatOpen(true);
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
    console.log('here ');
    console.log(prompt,selectedImageForChat);
    if (!prompt.trim() || !selectedImageForChat) return;
    
    
    console.log('here 2');
    
    // const userMessage = {
    //   role: 'user',
    //   text: prompt,
    //   images: [selectedImage],
    //   createdAt: new Date().toISOString()
    // };

    // setChatHistory(prev => [...prev, userMessage]);
    setPrompt('');

    const result = await continueChat(chatId, selectedImageForChat, prompt,getToken);
    
    if (result.success) {
      // setChatHistory(prev => [...prev, {
      //   role: 'assistant',
      //   text: result.response.text,
      //   images: result.response.images || [],
      //   createdAt: new Date().toISOString()
      // }]);
      updateTokens();
    }
  };
  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    
    return (
      <div key={index} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="w-8 h-8 backdrop-blur-sm bg-white/5 hover:border-red-600 border-red-600/50 shadow-xl flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}
        
        <div className={`max-w-2xl ${isUser ? 'order-first' : ''}`}>
          <Card className={`p-4 backdrop-blur-sm bg-white/5 hover:border-red-600 border-red-600/50 shadow-xl text-white `}>
            <p className="mb-3 ">{message.text}</p>
            
            {message.images && message.images.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {message.images.map((image, imgIndex) => (
                    <div key={imgIndex} className="group relative">
                      <img
                        src={image}
                        alt={`Generated thumbnail ${imgIndex + 1}`}
                        className={` w-full aspect-video object-cover  rounded-lg  ${image===selectedImageForChat ? " border border-red-700 hover:border-red-700 shadow-lg shadow-red-500/40 scale-105 ": "border border-border"}`}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        {image===selectedImageForChat ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleSelectImage()}
                            className="bg-white/10 hover:bg-black/90 text-white"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        ):(
                          <Tooltip>
                            <TooltipTrigger>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleContinueChat(image)}
                                className="bg-white/10 hover:bg-black/90 text-white"
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
                          className="bg-white/10 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-black/90 "
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadSingle(image);
                          }}
                          disabled={isDownloading}
                        >
                          <Download  />
                          
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
                    className="w-full bg-white/10 hover:bg-black hover:text-white"
                  >
                    <Download className="w-4 h-4" />
                    Download All as ZIP
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
        
        {isUser && (
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 mt-30 animate-spin text-white" />
      </div>
    );
  }

  return (
     <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <h2 className="text-lg text-white font-semibold">AI Thumbnail Generator</h2>
        <p className="text-sm text-white">Create amazing YouTube thumbnails with AI</p>
      </div>

      {/* Messages Area - Scrollable */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center my-15">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-lg text-white font-semibold mb-2">No messages yet</h3>
                <p className="text-white">Upload an image and describe your thumbnail to get started!</p>
              </div>
            </div>
          ) : (
            <>
              {messages[0]?.messages?.map((message, index) => renderMessage(message, index))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Input Form - Fixed */}
      {
        messages.length === 0 ? (
          <div className="border-t border-border p-6 flex-shrink-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 text-white md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="genre" className="mb-2">Genre</Label>
              <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="vlogs">Vlogs</SelectItem>
                  <SelectItem value="tech">tech</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="cooking">Cooking</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mood" className="mb-2">Mood</Label>
              <Select value={formData.mood} onValueChange={(value) => setFormData({ ...formData, mood: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exciting">Exciting</SelectItem>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="dramatic">Dramatic</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="fun">Fun</SelectItem>
                  <SelectItem value="serious">Serious</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="resolution" className="mb-2">Resolution</Label>
              <Select value={formData.resolution} onValueChange={(value) => setFormData({ ...formData, resolution: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1280 x 720">1280 x 720 (HD)</SelectItem>
                  <SelectItem value="1920 x 1080">1920 x 1080 (Full HD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title" className="mb-2">Video Title</Label>
              <Input
                id="title"
                placeholder="Enter video title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="file" className="mb-2 text-white">Upload Image</Label>
              <div className="w-[200%]">
                <FileInput  allowMultiple onFileChange={(files) => console.log(files)} />
              </div>
            </div>

            <div>
              <Label htmlFor="prompt" className="mb-2 text-white">Describe your thumbnail</Label>
              <Textarea
                id="prompt"
                placeholder="Describe what you want in your YouTube thumbnail..."
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                className="min-h-32"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isGenerating || !formData.prompt.trim() || !formData.file}
            variant="hero"
            className="w-full text-white"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isGenerating ? 'Generating Thumbnail...' : 'Generate Thumbnail'}
          </Button>
        </form>
      </div>
        ) : (
           <div className=" fixed bottom-0 right-0 w-300 bg-black border-t border-border p-6 flex gap-2 text-white ">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Continue the conversation about your thumbnail..."
                disabled={isGenerating || !selectedImageForChat}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!prompt.trim() || isGenerating}
                variant="hero"
              >
               {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
              </Button>
            </div>
        )
      }
       
    </div>
  );
}