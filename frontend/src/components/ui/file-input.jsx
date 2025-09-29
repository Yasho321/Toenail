import React, { useRef } from 'react';
import { Button } from './button';
import { Upload, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FileInput({ 
  onFileChange, 
  allowMultiple = false, 
  accept = "image/*",
  className,
  ...props 
}) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      onFileChange(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        multiple={allowMultiple}
        accept={accept}
        className="hidden"
        {...props}
      />
      
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        className="w-full h-24 border-2 border-dashed border-chat-border hover:border-gray-400 bg-chat-bg hover:bg-chat-surface-hover hover:text-gray-400 flex flex-col gap-2"
      >
        <Image className="w-6 h-6 text-chat-text-muted " />
        <div className="text-center">
          <div className="text-sm font-medium text-chat-text">Upload Image</div>
          <div className="text-xs text-chat-text-muted">Click to select file</div>
        </div>
      </Button>
    </div>
  );
}