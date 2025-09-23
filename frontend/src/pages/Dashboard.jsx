import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useChatStore } from '../stores/chatStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Plus, MessageSquare, Coins, Sparkles, Loader } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import ChatCard from '../components/ChatCard';
import { Link } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";


export default function Dashboard() {
   const { getToken } = useAuth();
  const { user } = useUser();
  const { chats, currentChat, fetchChats, createChat, setCurrentChat, isCreatingChat } = useChatStore();
  const { token, checkAuth, isCheckingAuth  } = useAuthStore();
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

  if(isCheckingAuth){
    return(
      <div className='flex bg-black items-center justify-center h-screen'> 
        <Loader className='text-white size-10 animate-spin' />
      </div>
    )
  }

  if (token <= 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-4">No Tokens Left</h2>
          <p className="text-white mb-6">
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
    <div className="h-screen w-full  relative flex">
      {/* Crimson Core Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
             "linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), radial-gradient(68% 58% at 50% 50%, #c81e3a 0%, #a51d35 16%, #7d1a2f 32%, #591828 46%, #3c1722 60%, #2a151d 72%, #1f1317 84%, #141013 94%, #0a0a0a 100%), radial-gradient(90% 75% at 50% 50%, rgba(228,42,66,0.06) 0%, rgba(228,42,66,0) 55%), radial-gradient(150% 120% at 8% 8%, rgba(0,0,0,0) 42%, #0b0a0a 82%, #070707 100%), radial-gradient(150% 120% at 92% 92%, rgba(0,0,0,0) 42%, #0b0a0a 82%, #070707 100%), radial-gradient(60% 50% at 50% 60%, rgba(240,60,80,0.06), rgba(0,0,0,0) 60%), #050505",
        }}
      />
      {/* Soft vignette to blend edges */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
          opacity: 0.95,
        }}
      />
      
      {/* Sidebar */}
     <div className="w-80 border-r border-border flex flex-col h-full relative z-10">
        {/* Header - Fixed */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl text-white font-bold">Toenail <span className="text-red-600">AI</span></h1>
            <UserButton />
          </div>
          
          {/* Token Display */}
          <div className="flex items-center justify-between  p-3  rounded-lg border">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Tokens</span>
            </div>
            <div className="flex items-center  gap-2">
              <span className="text-lg text-white font-bold">{token}</span>
              <Link to="/pricing" className='bg-black'>
                <Button variant="outline" size="sm" className='bg-black hover:bg-white/20'>
                  <Plus className="w-4 h-4 text-white " />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4 text-white flex-shrink-0">
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
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2 ">
            {chats.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-white mx-auto mb-4" />
                <p className="text-white">No chats yet</p>
                <p className="text-sm text-white">Create your first thumbnail!</p>
              </div>
            ) : (
              chats.map((chat) => (
                <ChatCard
                  key={chat._id}
                  chat={chat}
                  isSelected={selectedChatId === chat._id}
                  onSelect={handleSelectChat}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1 flex flex-col w-full h-[90%] relative z-10">
        
        {selectedChatId ? (
          <ChatInterface chatId={selectedChatId} />
        ) : (
          <div className="flex-1 flex items-center text-white mt-50 justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Create Your First Thumbnail</h2>
              <p className="text-white mb-6">
                Select a chat or create a new one to start generating amazing YouTube thumbnails with AI.
              </p>
              <Button onClick={handleCreateChat} variant="hero" disabled={token <= 0}>
                <Plus className="w-4 h-4" />
                Start Creating
              </Button>
            </div>
          </div>
        )}
      
      </ScrollArea>
    </div>
  );
}