import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sparkles, Edit3, Trash2, Check, X } from 'lucide-react';
import { useChatStore } from '../stores/chatStore';
import { useAuth } from '@clerk/clerk-react';

export default function ChatCard({ chat, isSelected, onSelect }) {
    const {getToken} = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title || 'Untitled Chat');
  const { renameChat, deleteChat } = useChatStore();

  const handleRename = async () => {
    if (editTitle.trim() && editTitle !== chat.title) {
      const success = await renameChat(chat._id, editTitle.trim(),getToken);
      if (success) {
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      await deleteChat(chat._id,getToken);
    }
  };

  const handleCardClick = () => {
    if (!isEditing) {
      onSelect(chat);
    }
  };

  return (
    <Card
      className={`p-2 sm:p-3 cursor-pointer backdrop-blur-sm bg-white/5 hover:border-red-600 border-red-600/50 shadow-xl transition-all duration-200 hover:bg-white/10 group w-full lg:w-73  ${
        isSelected ? 'bg-white/20 border-red-700 ' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
        
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div className="flex text-white bg-black items-center gap-1 sm:gap-2" onClick={(e) => e.stopPropagation()}>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                className="h-6 sm:h-8 text-xs sm:text-sm"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRename}
                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
              >
                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          ) : (
            <>
              <h3 className="font-medium truncate text-white text-xs sm:text-sm">
                {chat.title || 'Untitled Chat'}
              </h3>
              <p className="text-xs text-white">
                {new Date(chat.createdAt).toLocaleDateString()}
              </p>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center bg-white/10 hover:bg-black hover:bg-black/10 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-white hover:text-black"
            >
              <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 hover:text-black" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-destructive hover:text-destructive hover:text-black"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 hover:text-red-600" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}