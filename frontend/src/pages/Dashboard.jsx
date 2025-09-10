import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Plus, MessageSquare, Coins, Sparkles } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import { Link } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";


export default function Dashboard() {
   const { getToken } = useAuth();
  const { user } = useUser();
  const { chats, currentChat, fetchChats, createChat, setCurrentChat, isCreatingChat } = useChatStore();
  const { token, checkAuth, isCheckingAuth } = useAuthStore();
  const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
    if (user) {
      checkAuth(getToken);
      fetchChats(getToken);
    }
  }, [user]);

  const handleCreateChat = async () => {
    if (token <= 0) {
      return;
    }
    const newChat = await createChat(getToken);
    if (newChat) {
      setSelectedChatId(newChat._id);
      setCurrentChat(newChat);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChatId(chat._id);
    setCurrentChat(chat);
  };

  if (token <= 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Coins className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-4">No Tokens Left</h2>
          <p className="text-muted-foreground mb-6">
            You need tokens to create thumbnails. Purchase a package to continue.
          </p>
          <Link to="/pricing">
            <Button variant="hero" className="w-full">
              Buy Tokens
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">ThumbnailAI</h1>
            <UserButton />
          </div>
          
          {/* Token Display */}
          <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Tokens</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{token}</span>
              <Link to="/pricing">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={handleCreateChat}
            disabled={isCreatingChat || token <= 0}
            className="w-full"
            variant="hero"
          >
            <Plus className="w-4 h-4" />
            New Thumbnail Chat
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chats.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No chats yet</p>
              <p className="text-sm text-muted-foreground">Create your first thumbnail!</p>
            </div>
          ) : (
            chats.map((chat) => (
              <Card
                key={chat._id}
                className={`p-3 cursor-pointer transition-all duration-200 hover:bg-accent ${
                  selectedChatId === chat._id ? 'bg-accent border-primary/50' : ''
                }`}
                onClick={() => handleSelectChat(chat)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium truncate">
                      {chat.title || 'Untitled Chat'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedChatId ? (
          <ChatInterface chatId={selectedChatId} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Create Your First Thumbnail</h2>
              <p className="text-muted-foreground mb-6">
                Select a chat or create a new one to start generating amazing YouTube thumbnails with AI.
              </p>
              <Button onClick={handleCreateChat} variant="hero" disabled={token <= 0}>
                <Plus className="w-4 h-4" />
                Start Creating
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}