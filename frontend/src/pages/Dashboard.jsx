import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import { useThumbnailStore } from '@/stores/thumbnailStore';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  MessageSquare, 
  Youtube, 
  LogOut, 
  Coins, 
  Download, 
  Upload,
  Send,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import ImageGallery from '@/components/ImageGallery';
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { authUser, token, logout , updateTokens } = useAuthStore();
  const { 
    chats, 
    currentChatId, 
    createChat, 
    fetchChats, 
    setCurrentChat,
    isCreatingChat,
    isLoadingChats 
  } = useChatStore();
  const { 
    messages, 
    fetchMessages, 
    createThumbnail, 
    downloadImages,
    isLoadingMessages,
    isCreatingThumbnail,
    isDownloading 
  } = useThumbnailStore();

  const [thumbnailForm, setThumbnailForm] = useState({
    genre: '',
    mood: '',
    title: '',
    resolution: '1280 x 720',
    prompt: '',
    file: null
  });

  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    if (authUser) {
      fetchChats();
    }
  }, [authUser]);

  useEffect(() => {
    if (currentChatId) {
      fetchMessages(currentChatId);
    }
  }, [currentChatId]);

  if (!authUser) {
    return <Navigate to="/" replace />;
  }

  if (token <= 0) {
    return <Navigate to="/pricing" replace />;
  }

  const handleCreateChat = async () => {
    const chatId = await createChat();
    if (chatId) {
      setCurrentChat(chatId);
    }
  };

  const handleThumbnailSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentChatId) {
      toast.error('Please select or create a chat first');
      return;
    }

    if (!thumbnailForm.file) {
      toast.error('Please upload an image');
      return;
    }

    const formData = new FormData();
    formData.append('genre', thumbnailForm.genre);
    formData.append('mood', thumbnailForm.mood);
    formData.append('title', thumbnailForm.title);
    formData.append('resolution', thumbnailForm.resolution);
    formData.append('prompt', thumbnailForm.prompt);
    formData.append('file', thumbnailForm.file);

    const response = await createThumbnail(currentChatId, formData);
    await updateTokens();
    if (response) {
      setThumbnailForm({
        genre: '',
        mood: '',
        title: '',
        resolution: '1280 x 720',
        prompt: '',
        file: null
      });
      // Reset file input

      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setThumbnailForm(prev => ({ ...prev, file }));
  };

  const handleDownloadSelected = () => {
    if (selectedImages.length === 0) {
      toast.error('Please select images to download');
      return;
    }
    downloadImages(selectedImages);
  };

  const toggleImageSelection = (imageUrl) => {
    setSelectedImages(prev => 
      prev.includes(imageUrl) 
        ? prev.filter(url => url !== imageUrl)
        : [...prev, imageUrl]
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Youtube className="h-6 w-6 text-red-600" />
              <span className="font-bold text-lg text-white">Toenail AI</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-muted-foreground hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-white">Tokens:</span>
            <div className="flex items-center space-x-1 text-primary font-medium">
              <Coins className="h-4 w-4 text-red-600" />
              <span>{token}</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <Button 
            onClick={handleCreateChat}
            disabled={isCreatingChat}
            variant="hero"
            size="sm"
            className="w-full text-red-600"
          >
            {isCreatingChat ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoadingChats ? (
            <div className="text-center text-muted-foreground">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm">
              No chats yet. Create your first chat!
            </div>
          ) : (
            chats.map((chat) => (
              <Button
                key={chat._id}
                variant={currentChatId === chat._id ? "secondary" : "ghost"}
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => setCurrentChat(chat._id)}
              >
                <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0 text-red-600" />
                <span className="truncate text-white">{chat.title}</span>
              </Button>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">
              {currentChatId ? 'Create Thumbnail' : 'Welcome to ThumbnailAI'}
            </h1>
            <div className='mx-20'>
                 <Link
                    to="/pricing"
                    className="text-white hover:text-red-600 mx-10 "
                    >
                    Pricing
                </Link>
            {selectedImages.length > 0 && (
              <Button
                onClick={handleDownloadSelected}
                disabled={isDownloading}
                variant="outline"
                size="sm"
                className={"text-red-600"}
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2 " />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Download Selected ({selectedImages.length})
              </Button>
            )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Creation Form */}
          <div className="w-1/3 p-4 border-r border-border">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create Thumbnail</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleThumbnailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Upload Image *</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => document.getElementById('file-upload').click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {thumbnailForm.file ? thumbnailForm.file.name : 'Choose Image'}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prompt">Prompt *</Label>
                    <Textarea
                      id="prompt"
                      value={thumbnailForm.prompt}
                      onChange={(e) => setThumbnailForm(prev => ({ ...prev, prompt: e.target.value }))}
                      placeholder="Describe your thumbnail idea..."
                      required
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="genre">Genre</Label>
                      <Input
                        id="genre"
                        value={thumbnailForm.genre}
                        onChange={(e) => setThumbnailForm(prev => ({ ...prev, genre: e.target.value }))}
                        placeholder="e.g., cooking, gaming"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mood">Mood</Label>
                      <Input
                        id="mood"
                        value={thumbnailForm.mood}
                        onChange={(e) => setThumbnailForm(prev => ({ ...prev, mood: e.target.value }))}
                        placeholder="e.g., happy, exciting"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={thumbnailForm.title}
                      onChange={(e) => setThumbnailForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Video title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Resolution</Label>
                    <Select
                      value={thumbnailForm.resolution}
                      onValueChange={(value) => setThumbnailForm(prev => ({ ...prev, resolution: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1280 x 720(video)">1280 x 720 (Video)</SelectItem>
                        <SelectItem value="1080 x 1920(shorts)">1080 x 1920 (Shorts)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isCreatingThumbnail || !currentChatId}
                    variant="hero"
                    className="w-full hover:text-red-600"
                  >
                    {isCreatingThumbnail ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Generate Thumbnail
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Messages Display */}
          <div className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-60px)]">
            {currentChatId ? (
              <div className="space-y-4 pb-4">
                {isLoadingMessages ? (
                  <div className="text-center text-muted-foreground">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    No messages yet. Create your first thumbnail!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <Card key={index} className={`${message.role === 'user' ? 'ml-8' : 'mr-8'} shadow-card`}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.role === 'user' ? 'bg-primary' : 'bg-secondary'
                            }`}>
                              {message.role === 'user' ? (
                                <span className="text-primary-foreground font-medium">U</span>
                              ) : (
                                <span className="text-red-600 font-medium">AI</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground mb-2">
                                {new Date(message.createdAt).toLocaleString()}
                              </p>
                              <p className="text-foreground mb-3">{message.text}</p>
                              {message.images && message.images.length > 0 && (
                                <ImageGallery 
                                  images={message.images}
                                  selectedImages={selectedImages}
                                  onImageSelect={toggleImageSelection}
                                  onDownload={handleDownloadSelected}
                                />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Youtube className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2 text-red-600">Ready to Create?</h2>
                  <p className="text-muted-foreground mb-4">
                    Select a chat or create a new one to start generating thumbnails
                  </p>
                  <Button onClick={handleCreateChat} variant="hero">
                    <Plus className="h-4 w-4 mr-2 " />
                    Create New Chat
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;