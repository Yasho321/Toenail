import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sparkles, Edit3, Trash2, Check, X, Pin, PinOff, Bookmark } from 'lucide-react';
import { useChatStore } from '../stores/chatStore';
import { useAuth } from '@clerk/clerk-react';

export default function ChatCard({ chat, isSelected, onSelect }) {
  const { getToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title || 'Untitled Chat');
  const { renameChat, deleteChat, pinChat, unpinChat } = useChatStore();

  const handleRename = async () => {
    if (editTitle.trim() && editTitle !== chat.title) {
      const success = await renameChat(chat._id, editTitle.trim(), getToken);
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
      await deleteChat(chat._id, getToken);
    }
  };

  const handlePin = async (e) => {
    e.stopPropagation();
    if (chat.pinned) {
      await unpinChat(chat._id, getToken);
    } else {
      await pinChat(chat._id, getToken);
    }
  };

  const handleCardClick = () => {
    if (!isEditing) {
      onSelect(chat);
    }
  };

  return (
    <Card
      className={`p-3 cursor-pointer text-white w-[60%] transition-all duration-200 group relative ${
        isSelected 
          ? 'bg-[#0B0B0F]  shadow-xl shadow-primary/40' 
          : ' bg-[#151015] border-none  hover:bg-chat-surface-hover '
      }`}
      onClick={handleCardClick}
    >
      {/* Pin indicator */}
      {chat.pinned && (
        <div className="absolute top-2 right-2">
          <Bookmark className="w-3 h-3 text-white fill-pin" />
        </div>
      )}

      <div className="flex items-start gap-3">
        
        
        <div className="min-w-0 flex-1 pr-6">
          {isEditing ? (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                className="h-8 text-sm bg-chat-bg border-chat-border text-chat-text"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRename}
                className="h-8 w-8 p-0 text-chat-text hover:text-primary"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="h-8 w-8 p-0 text-chat-text hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <h3 className="font-medium flex items-center truncate text-chat-text text-sm mb-1">
                {chat.title || 'Untitled Chat'}
              </h3>
             
            </>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePin}
              className="h-8 w-8 p-0 text-white bg-[#0B0B0F] hover:text-white hover:bg-[#1E1A1F]"
              title={chat.pinned ? 'Unpin chat' : 'Pin chat'}
            >
              {chat.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="h-8 w-8 p-0 text-white bg-[#0B0B0F] hover:text-white hover:bg-[#1E1A1F]"
              title="Rename chat"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-white bg-[#0B0B0F]  hover:bg-[#1E1A1F] hover:text-destructive"
              title="Delete chat"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}