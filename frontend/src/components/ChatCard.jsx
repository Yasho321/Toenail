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
      className={`p-3 cursor-pointer transition-all duration-200 hover:bg-accent group ${
        isSelected ? 'bg-accent border-primary/50' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                className="h-8 text-sm"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRename}
                className="h-8 w-8 p-0"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <h3 className="font-medium truncate">
                {chat.title || 'Untitled Chat'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {new Date(chat.createdAt).toLocaleDateString()}
              </p>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="h-8 w-8 p-0"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}