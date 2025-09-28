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
      <div className='flex bg-[#1E1A1F] items-center justify-center h-screen'> 
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
    <div className="h-screen w-full bg-[#1E1A1F] text-white relative flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-[#151015] shadow-lg bg-[#1E1A1F] flex flex-col h-full transition-all duration-300 relative z-10`}>
        {/* Header */}
        <div className={`p-4  flex-shrink-0 ${sidebarCollapsed ? 'px-2' : ''}`}>
          {!sidebarCollapsed && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl flex text-white font-bold">
                 <img className='w-6 h-6 rounded-lg mr-2' src="./logo.png"/> Toenail <span className="text-red-500">AI</span>
                </h1>
                <div className='mr-10'><UserButton /></div>
                
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1  gap-2 mb-4">
                {/* Tokens */}
                <Card className="p-3 bg-[#151015] border-none">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-white" />
                    <div className='flex items-center'>
                      
                      <div className="text-lg font-bold text-white">Tokens : {token}</div>
                    </div>
                  </div>
                </Card>
                
                {/* Pricing */}
                <Link to="/pricing">
                  <Card className="p-3 bg-[#151015] border-none  hover:bg-[#151015]/80 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-white" />
                      <div>
                        
                        <div className="text-sm  font-medium text-white"> Buy Tokens</div>
                      </div>
                    </div>
                  </Card>
                </Link>
                
                {/* Transactions */}
                <Link to="/transactions">
                  <Card className="p-3 bg-[#151015] border-none  hover:bg-[#151015]/80 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-white" />
                      <div className='flex items-center'>
                        
                        <div className="text-sm font-medium text-white">Transaction History</div>
                      </div>
                    </div>
                  </Card>
                </Link>
                <div className="flex items-center gap-2">
                    <Button
                      onClick={handleCreateChat}
                      disabled={isCreatingChat}
                      className="l bg-[#151015] hover:bg-[#0B0B0F]/90 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Chat
                    </Button>
                  </div>
              </div>
            </>
          )}
          
          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`text-white hover:bg-[#151015] hover:text-white  ${sidebarCollapsed ? 'w-full' : 'absolute top-4 right-4'}`}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* New Chat Button */}
        

        {/* Chat List */}
        {!sidebarCollapsed && (
          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Pinned Chats */}
              {pinnedChats.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Bookmark className="w-4 h-4 text-white fill-pin" />
                    <h3 className="text-sm font-medium text-white/70">Pinned</h3>
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
                    <h3 className="text-sm font-medium text-white/70 mb-3">Recent</h3>
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
                  <MessageSquare className="w-12 h-12 text-white/50 mx-auto mb-4" />
                  <p className="text-white text-sm">No chats yet</p>
                  <p className="text-xs text-white/70">Create your first thumbnail!</p>
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
              className="bg-[#0B0B0F] hover:bg-[#0B0B0F]/90 text-white"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </Button>
            
            {pinnedChats.length > 0 && (
              <div className="w-8 h-1 bg-[#0B0B0F] rounded-full" title={`${pinnedChats.length} pinned chats`} />
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
              <div className="w-16 h-16 bg-[#0B0B0F]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Create Your First Thumbnail</h2>
              <p className="text-white-muted mb-6">
                Select a chat or create a new one to start generating amazing YouTube thumbnails with AI.
              </p>
              <Button onClick={handleCreateChat} className="bg-[#0B0B0F] hover:bg-[#0B0B0F]/90">
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