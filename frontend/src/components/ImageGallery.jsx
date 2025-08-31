import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Image as ImageIcon, Check, Copy } from 'lucide-react';
import { useThumbnailStore } from '@/stores/thumbnailStore';
import toast from 'react-hot-toast';

const ImageGallery = ({ images, selectedImages, onImageSelect, onDownload }) => {
  const { downloadImages, isDownloading } = useThumbnailStore();

  if (!images || images.length === 0) {
    return null;
  }

  const handleCopyImage = async (imageUrl) => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      toast.success('Image URL copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy image URL');
    }
  };

  const handleDownloadSingle = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
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
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleDownloadAll = () => {
    downloadImages(images);
  };

  return (
    <div className="space-y-4">
      {/* Download All Button */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{images.length} images generated</span>
        <Button
          onClick={handleDownloadAll}
          disabled={isDownloading}
          variant="outline"
          size="sm"
        >
          {isDownloading ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Download All as ZIP
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((imageUrl, index) => (
          <Card 
            key={index} 
            className={`relative group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-glow ${
              selectedImages.includes(imageUrl) ? 'ring-2 ring-primary shadow-primary' : ''
            }`}
            onClick={() => onImageSelect(imageUrl)}
          >
          <div className="aspect-video relative">
            <img
              src={imageUrl}
              alt={`Generated thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Overlay */}
            <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
              selectedImages.includes(imageUrl) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              <div className="absolute inset-0 flex items-center justify-center">
                {selectedImages.includes(imageUrl) ? (
                  <div className="bg-primary rounded-full p-2">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                ) : (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon className="h-6 w-6 text-white mb-2 mx-auto" />
                    <p className="text-white text-sm font-medium">Click to select</p>
                  </div>
                )}
              </div>
            </div>

            {/* Individual Action Buttons */}
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadSingle(imageUrl);
                  }}
                  disabled={isDownloading}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyImage(imageUrl);
                  }}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy URL
                </Button>
              </div>
            </div>

            {/* Selection indicator */}
            {selectedImages.includes(imageUrl) && (
              <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        </Card>
      ))}
      </div>
    </div>
  );
};

export default ImageGallery;