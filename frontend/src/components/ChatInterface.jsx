import { useState, useEffect, useRef } from 'react';
import { useThumbnailStore } from '../stores/thumbnailStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Send, Download, Loader2, Image as ImageIcon, Bot, User, MessageCircle, X, Plus, Camera, ArrowUp, Paperclip } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useChatStore } from '../stores/chatStore';
import FileInput from './ui/file-input';
import toast from 'react-hot-toast';
import Joyride from 'react-joyride';

export default function ChatInterface({ chatId }) {
  const { getToken } = useAuth();
  const { messages, isLoading, isGenerating, fetchMessages, generateThumbnail, continueChat } = useThumbnailStore();
  const { fetchChats } = useChatStore();
  const { updateTokens, token } = useAuthStore();
  const messagesEndRef = useRef(null);
  const [onboard2,setOnboard2]=useState(false);
  const [onboard3,setOnboard3]=useState(false);
  const [prompt, setPrompt] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedImageForChat, setSelectedImageForChat] = useState(null);
  const [showOptionsPopover, setShowOptionsPopover] = useState(false);
  const [showVideoTitleDialog, setShowVideoTitleDialog] = useState(false);

  // Form fields for new thumbnail generation
  const [formData, setFormData] = useState({
    genre: '',
    mood: '',
    resolution: '1280 x 720',
    title: '',
    file: null,
    prompt: ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(()=>{
      const tour2complete=localStorage.getItem('tour2complete');
      const tour3complete=localStorage.getItem('tour3complete');
      if(!tour2complete){
        setOnboard2(true);
      }
      if(!tour3complete){
        setOnboard3(true);
      }
    },[])

    const onboardCallback2=(data)=>{
      const {status,action}=data;
      if(status==='finished'||status==='skipped'||action==='close'){
        localStorage.setItem('tour2complete',true);
        setOnboard2(false);
      }
      
    }
    const onboardCallback3=(data)=>{
        const {status,action}=data;
        if(status==='finished'||status==='skipped'||action==='close'){
          localStorage.setItem('tour3complete',true);
          setOnboard3(false);
        }
        
      }



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

  const handleFileChange = (files) => {
    const file = files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPG, PNG, WEBP)');
        return;
      }

      setFormData({ ...formData, file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if(isFormComplete()) setShowOptionsPopover(false);
      
    }
  };

  const handleVideoTitleSubmit = (title) => {
    setFormData({ ...formData, title });
    setShowVideoTitleDialog(false);
  };

  const isFormComplete = () => {
    return  formData.genre && formData.mood && formData.resolution && formData.title && formData.file && formData.prompt.trim() || selectedImageForChat;
  };

  const handleGenerateThumbnail = async () => {
    if (!isFormComplete()) {
      toast.error('Please fill all fields');
      return;
    }

    await fetchChats(getToken);
    if (token <= 0) {
      toast.error("Not enough tokens to continue");
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
      updateTokens();
      // Reset form
      setFormData({
        genre: '',
        mood: '',
        resolution: '1280 x 720',
        title: '',
        file: null,
        prompt: ''
      });
      setPreviewUrl(null);
      toast.success('Thumbnail generated successfully!');
    }
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
  const steps = [{
    target : '#add-image-and-metadata-button',
    content: 'Add your image and metadata about the video here(Compulsary to enable the generate thumbnail button)',
  },{
    target : '#add-prompt',
    content: 'Add your prompt here(Compulsary to enable the generate thumbnail button)',
  },{
    target : '#generate-button',
    content: 'Click here to generate the thumbnail',
  }]

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (selectedImageForChat) {
        handleSendMessage();
      } else {
        
        setFormData({ ...formData, prompt });
      }
    }
  };

  const handleSendMessage = async () => {
    if (messages.length === 0) return;

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
    setSelectedImageForChat(null);
  };

  const steps2=[{
    target:"#select-image",
    content:"Select the image you want to edit using follow-up messages(Compulsary to enable the generate thumbnail button)",
  },{
    target:"#add-prompt",
    content:"Add your prompt here to edit the image(Compulsary to enable the generate thumbnail button)",
  },{
    target:"#generate-button",
    content:"Click here to generate the edited thumbnail",
  }]

  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    
    return (
      <div key={index} className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} mt-6 `}>
        {!isUser && (
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}
        
        <div className={`max-w-[60%] border-none  ${isUser ? 'order-first' : ''}`}>
          <Card className={`p-4 ${
            isUser 
              ? 'bg-[#151015] border-none text-white ml-auto' 
              : 'bg-[#151015] border-none'
          }`}>
            <p className="mb-3 text-sm text-white leading-relaxed">{message.text}</p>
            
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
                            ? " shadow-lg shadow-primary/40 scale-[1.02]" 
                            : " hover:border-primary/50"
                        }`}
                        onClick={() => handleContinueChat(image)}
                      />
                      <div className="absolute inset-0 bg-[#0B0B0F]/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
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
                                id={imgIndex===1?"select-image":""}
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
                    className="w-full border-none text-white bg-[#0B0B0F] hover:bg-[#1E1A1F] hover:text-white"
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

        {onboard3 && <Joyride steps={steps2} callback={onboardCallback3}  continuous={true} showProgress={true} />}
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
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Hello there!
            </h2>
            <p className="text-white-muted mb-8 text-lg">
              How can I help you create amazing thumbnails today?
            </p>
          </div>
        </div>
      ) : (
        /* Messages */
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-6 space-y-0">
            {messages[0]?.messages?.map((message, index) => renderMessage(message, index))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      )}

      {/* Enhanced Input Area */}
      <div className="bg-chat-surface p-4">
        {/* Selected Values Display */}
        {!selectedImageForChat && (formData.genre || formData.mood || formData.resolution || formData.file || formData.prompt  || formData.title || previewUrl) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {formData.genre && (
              <div className="bg-primary/10 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                Genre: {formData.genre}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData({ ...formData, genre: '' })}
                  className="h-4 w-4 p-0 hover:bg-primary/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            {formData.mood && (
              <div className="bg-primary/10 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                Mood: {formData.mood}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData({ ...formData, mood: '' })}
                  className="h-4 w-4 p-0 hover:bg-primary/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            {formData.resolution !== '1280 x 720'  && (
              <div className="bg-primary/10 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                Resolution: {formData.resolution}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData({ ...formData, resolution: '1280 x 720' })}
                  className="h-4 w-4 p-0 hover:bg-primary/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            {formData.title && (
              <div className="bg-primary/10 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                Title: {formData.title}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData({ ...formData, title: '' })}
                  className="h-4 w-4 p-0 hover:bg-primary/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
            {previewUrl && (
              <div className="bg-primary/10 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                Image uploaded
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                    setFormData({ ...formData, file: null });
                  }}
                  className="h-4 w-4 p-0 hover:bg-primary/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 items-end">
          {/* Plus Button with Options */}
          <Popover open={showOptionsPopover} onOpenChange={setShowOptionsPopover}>
            <PopoverTrigger asChild>
              <Button id="add-image-and-metadata-button"
                variant="outline"
                size="icon"
                className="border-none bg-[#0B0B0F] hover:bg-[#1E1A1F] hover:text-white"
              >
                <Plus className="w-4 h-4 " />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              side="top" 
              className="w-80 bg-[#0B0B0F] border-chat-border text-white p-2"
            >
              <div className="space-y-2">
                {/* Add Photo Option */}
                <div className="p-2">
                  <FileInput 
                    allowMultiple={false} 
                    onFileChange={handleFileChange}
                    className="w-full bg-[#0B0B0F]  text-white"
                  />
                </div>

                {/* Genre Select */}
                <div>
                  <Select 
                    value={formData.genre} 
                    onValueChange={(value) => {
                      setFormData({ ...formData, genre: value });
                      if(isFormComplete()) setShowOptionsPopover(false);
                    }}
                  >
                    <SelectTrigger className="w-full bg-chat-bg border-chat-border text-white">
                      <SelectValue placeholder="Select Genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B0B0F] text-white border-chat-border">
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="vlogs">Vlogs</SelectItem>
                      <SelectItem value="tech">Tech</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="cooking">Cooking</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mood Select */}
                <div>
                  <Select 
                    value={formData.mood} 
                    onValueChange={(value) => {
                      setFormData({ ...formData, mood: value });
                      if(isFormComplete()) setShowOptionsPopover(false);
                    }}
                  >
                    <SelectTrigger className="w-full bg-[#0B0B0F] text-white border-chat-border">
                      <SelectValue placeholder="Select Mood" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B0B0F] text-white border-chat-border">
                      <SelectItem value="exciting">Exciting</SelectItem>
                      <SelectItem value="happy">Happy</SelectItem>
                      <SelectItem value="dramatic">Dramatic</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="fun">Fun</SelectItem>
                      <SelectItem value="serious">Serious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Resolution Select */}
                <div>
                  <Select 
                    value={formData.resolution} 
                    onValueChange={(value) => {
                      setFormData({ ...formData, resolution: value });
                      if(isFormComplete()) setShowOptionsPopover(false);
                    }}
                  >
                    <SelectTrigger className="w-full bg-[#0B0B0F] text-white border-chat-border ">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B0B0F] text-white border-chat-border">
                      <SelectItem value="1280 x 720">1280 x 720 (HD)</SelectItem>
                      <SelectItem value="1920 x 1080">1920 x 1080 (Full HD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Video Title Button */}
                <Button
                  variant="ghost"
                  className="w-full justify-start bg-[#0B0B0F] text-white hover:text-white hover:bg-[#1E1A1F]"
                  onClick={() => {
                    setShowVideoTitleDialog(true);
                    if(isFormComplete()) setShowOptionsPopover(false);
                  }}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Video Title
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex-1">
            <Input
             id="add-prompt"
              value={!selectedImageForChat ? formData.prompt : prompt}
              onChange={(e) => {
                if (!selectedImageForChat) {
                  setFormData({ ...formData, prompt: e.target.value });
                } else {
                  setPrompt(e.target.value);
                }
              }}
              onKeyPress={handleKeyPress}
              maxLength={10000}
              placeholder={
                (messages.length === 0 && !selectedImageForChat)
                  ? "Describe your thumbnail..." 
                  : selectedImageForChat 
                    ? "Continue the conversation about your thumbnail..." 
                    : "Start a new thumbnail project..."
              }
              disabled={isGenerating}
              className="bg-[#151015] rounded-xl shadow-xl border-none text-white placeholder:text-white-muted"
            />
          </div>
          
          <Button
            id="generate-button"
            onClick={ selectedImageForChat ? handleSendMessage : handleGenerateThumbnail  }
            disabled={
              selectedImageForChat 
                ?  !prompt.trim()|| isGenerating
                : (!isFormComplete() || isGenerating )
            }
            className="bg-primary hover:bg-primary/90"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {selectedImageForChat && (
          <div className="mt-3 flex items-center gap-2 text-sm text-white-muted">
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

      {/* Video Title Dialog */}
      <Dialog open={showVideoTitleDialog} onOpenChange={setShowVideoTitleDialog}>
        <DialogContent className="bg-black border-chat-border text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Enter Video Title</DialogTitle>
          </DialogHeader>
          <div className="space-y-4  text-white">
            <Input
              placeholder="Enter your video title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border-chat-border text-white"
              maxLength={100}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleVideoTitleSubmit(formData.title);
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowVideoTitleDialog(false)}
                className="flex-1 bg-black "
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleVideoTitleSubmit(formData.title)}
                disabled={!formData.title.trim()}
                className="flex-1  hover:bg-primary/90"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {onboard2 && <Joyride steps={steps} callback={onboardCallback2}  continuous={true} scrollToFirstStep={true} showProgress={true}  />}
    </div>
  );
}