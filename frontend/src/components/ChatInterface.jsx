import { useState, useEffect, useRef } from 'react';
import { useThumbnailStore } from '../stores/thumbnailStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Send, Upload, Download, Loader2, Image as ImageIcon, Bot, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

export default function ChatInterface({ chatId }) {
  const {getToken} = useAuth();
  const { messages, isLoading, isGenerating, fetchMessages, generateThumbnail } = useThumbnailStore();
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

  const handleDownloadAll = async (images) => {
    try {
      const token =await getToken();
      const response = await fetch('/api/v1/download/download-zip', {
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

  const renderMessage = (message, index) => {
    const isUser = message.role === 'user';
    
    return (
      <div key={index} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
        
        <div className={`max-w-2xl ${isUser ? 'order-first' : ''}`}>
          <Card className={`p-4 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
            <p className="mb-3">{message.text}</p>
            
            {message.images && message.images.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {message.images.map((image, imgIndex) => (
                    <div key={imgIndex} className="group relative">
                      <img
                        src={image}
                        alt={`Generated thumbnail ${imgIndex + 1}`}
                        className="w-full aspect-video object-cover rounded-lg border border-border"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <a
                          href={image}
                          download
                          className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium hover:bg-primary/90"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                
                {!isUser && message.images.length > 1 && (
                  <Button
                    onClick={() => handleDownloadAll(message.images)}
                    variant="outline"
                    size="sm"
                    className="w-full"
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
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-secondary-foreground" />
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
    <div className="flex-1 flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-muted-foreground">Upload an image and describe your thumbnail to get started!</p>
            </div>
          </div>
        ) : (
          <>
            {messages[0]?.messages?.map((message, index) => renderMessage(message, index))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-border p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="cooking">Cooking</SelectItem>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mood">Mood</Label>
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
              <Label htmlFor="resolution">Resolution</Label>
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
              <Label htmlFor="title">Video Title</Label>
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
              <Label htmlFor="file">Upload Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="max-h-32 rounded-lg" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <span className="text-muted-foreground">Click to upload image</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="prompt">Describe your thumbnail</Label>
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
            className="w-full"
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
    </div>
  );
}