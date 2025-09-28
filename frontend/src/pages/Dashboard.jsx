import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Plus, MessageSquare, Coins, Sparkles, Loader, Menu, X, CreditCard, Receipt, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import ChatCard from '../components/ChatCard';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const { chats, currentChat, fetchChats, createChat, setCurrentChat, isCreatingChat } = useChatStore();
  const { token, checkAuth, isCheckingAuth } = useAuthStore();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (user) {
      checkAuth(getToken);
      fetchChats(getToken);
    }
  }, [user]);

  const handleCreateChat = async () => {
    if (token <= 0) {
      toast.error("Not enough tokens to continue")
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

  if (isCheckingAuth) {
    return (
      <div className='flex bg-chat-bg items-center justify-center h-screen'> 
        <Loader className='text-primary size-10 animate-spin' />
      </div>
    )
  }

  // Sort chats: pinned first, then by creation date
  const sortedChats = [...chats].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const pinnedChats = sortedChats.filter(chat => chat.pinned);
  const regularChats = sortedChats.filter(chat => !chat.pinned);

  return (
    <div className="h-screen w-full bg-chat-bg relative flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} border-r border-chat-border bg-sidebar flex flex-col h-full transition-all duration-300 relative z-10`}>
        {/* Header */}
        <div className={`p-4 border-b border-chat-border flex-shrink-0 ${sidebarCollapsed ? 'px-2' : ''}`}>
          {!sidebarCollapsed && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl text-sidebar-foreground font-bold">
                  Toenail <span className="text-primary">AI</span>
                </h1>
                <UserButton />
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {/* Tokens */}
                <Card className="p-3 bg-sidebar-accent border-sidebar-border">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-xs text-sidebar-foreground/70">Tokens</div>
                      <div className="text-lg font-bold text-sidebar-foreground">{token}</div>
                    </div>
                  </div>
                </Card>
                
                {/* Pricing */}
                <Link to="/pricing">
                  <Card className="p-3 bg-sidebar-accent border-sidebar-border hover:bg-sidebar-accent/80 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-xs text-sidebar-foreground/70">Buy</div>
                        <div className="text-sm font-medium text-sidebar-foreground">More</div>
                      </div>
                    </div>
                  </Card>
                </Link>
                
                {/* Transactions */}
                <Link to="/transactions">
                  <Card className="p-3 bg-sidebar-accent border-sidebar-border hover:bg-sidebar-accent/80 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-primary" />
                      <div>
                        <div className="text-xs text-sidebar-foreground/70">History</div>
                        <div className="text-sm font-medium text-sidebar-foreground">View</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            </>
          )}
          
          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`text-sidebar-foreground hover:bg-sidebar-accent ${sidebarCollapsed ? 'w-full' : 'absolute top-4 right-4'}`}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* New Chat Button */}
        {!sidebarCollapsed && (
          <div className="p-4 text-sidebar-foreground flex-shrink-0">
            <Button
              onClick={handleCreateChat}
              disabled={isCreatingChat}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Thumbnail Chat
            </Button>
          </div>
        )}

        {/* Chat List */}
        {!sidebarCollapsed && (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Pinned Chats */}
              {pinnedChats.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Bookmark className="w-4 h-4 text-pin fill-pin" />
                    <h3 className="text-sm font-medium text-sidebar-foreground/70">Pinned</h3>
                  </div>
                  <div className="space-y-2">
                    {pinnedChats.map((chat) => (
                      <ChatCard
                        key={chat._id}
                        chat={chat}
                        isSelected={selectedChatId === chat._id}
                        onSelect={handleSelectChat}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Regular Chats */}
              {regularChats.length > 0 && (
                <div>
                  {pinnedChats.length > 0 && (
                    <h3 className="text-sm font-medium text-sidebar-foreground/70 mb-3">Recent</h3>
                  )}
                  <div className="space-y-2">
                    {regularChats.map((chat) => (
                      <ChatCard
                        key={chat._id}
                        chat={chat}
                        isSelected={selectedChatId === chat._id}
                        onSelect={handleSelectChat}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Empty State */}
              {chats.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-sidebar-foreground/50 mx-auto mb-4" />
                  <p className="text-sidebar-foreground text-sm">No chats yet</p>
                  <p className="text-xs text-sidebar-foreground/70">Create your first thumbnail!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
        
        {/* Collapsed Sidebar Content */}
        {sidebarCollapsed && (
          <div className="flex-1 flex flex-col items-center py-4 space-y-4">
            <Button
              onClick={handleCreateChat}
              disabled={isCreatingChat}
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </Button>
            
            {pinnedChats.length > 0 && (
              <div className="w-8 h-1 bg-pin rounded-full" title={`${pinnedChats.length} pinned chats`} />
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedChatId ? (
          <ChatInterface chatId={selectedChatId} />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-chat-text mb-4">Create Your First Thumbnail</h2>
              <p className="text-chat-text-muted mb-6">
                Select a chat or create a new one to start generating amazing YouTube thumbnails with AI.
              </p>
              <Button onClick={handleCreateChat} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Start Creating
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}