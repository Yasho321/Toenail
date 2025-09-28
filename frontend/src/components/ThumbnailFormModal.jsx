import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Upload, Loader2, X, ImageIcon } from 'lucide-react';
import FileInput from './ui/file-input';
import toast from 'react-hot-toast';

export default function ThumbnailFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isGenerating 
}) {
  const [formData, setFormData] = useState({
    prompt: '',
    genre: '',
    mood: '',
    title: '',
    resolution: '1280 x 720',
    file: null
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (files) => {
    const file = files[0];
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

    const success = await onSubmit(submitData);
    
    if (success) {
      // Reset form
      setFormData({
        prompt: '',
        genre: '',
        mood: '',
        title: '',
        resolution: '1280 x 720',
        file: null
      });
      setPreviewUrl(null);
      onClose();
    }
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-chat-surface border-chat-border text-chat-text">
        <DialogHeader>
          <DialogTitle className="text-chat-text">Generate Thumbnail</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <Label className="text-chat-text">Upload Image</Label>
            <div className="mt-2">
              {previewUrl ? (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-32 object-cover rounded-lg border border-chat-border"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                      setFormData({ ...formData, file: null });
                    }}
                    className="absolute top-2 right-2 h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <FileInput 
                  allowMultiple={false} 
                  onFileChange={handleFileChange}
                  className="bg-chat-bg border-chat-border"
                />
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-chat-text">Genre</Label>
              <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                <SelectTrigger className="bg-chat-bg border-chat-border text-chat-text">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent className="bg-chat-surface border-chat-border">
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

            <div>
              <Label className="text-chat-text">Mood</Label>
              <Select value={formData.mood} onValueChange={(value) => setFormData({ ...formData, mood: value })}>
                <SelectTrigger className="bg-chat-bg border-chat-border text-chat-text">
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent className="bg-chat-surface border-chat-border">
                  <SelectItem value="exciting">Exciting</SelectItem>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="dramatic">Dramatic</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="fun">Fun</SelectItem>
                  <SelectItem value="serious">Serious</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-chat-text">Resolution</Label>
              <Select value={formData.resolution} onValueChange={(value) => setFormData({ ...formData, resolution: value })}>
                <SelectTrigger className="bg-chat-bg border-chat-border text-chat-text">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-chat-surface border-chat-border">
                  <SelectItem value="1280 x 720">1280 x 720 (HD)</SelectItem>
                  <SelectItem value="1920 x 1080">1920 x 1080 (Full HD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-chat-text">Video Title</Label>
              <Input
                placeholder="Enter video title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-chat-bg border-chat-border text-chat-text"
              />
            </div>
          </div>

          <div>
            <Label className="text-chat-text">Describe your thumbnail</Label>
            <Textarea
              placeholder="Describe what you want in your YouTube thumbnail..."
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              className="min-h-24 bg-chat-bg border-chat-border text-chat-text"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-chat-border hover:bg-chat-surface-hover"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isGenerating || !formData.prompt.trim() || !formData.file}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {isGenerating ? "Generating..." : 'Generate'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}