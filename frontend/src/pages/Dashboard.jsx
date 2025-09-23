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
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";
import toast from 'react-hot-toast';


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

  if(isCheckingAuth){
    return(
      <div className='flex bg-black items-center justify-center h-screen'> 
        <Loader className='text-white size-10 animate-spin' />
      </div>
    )
  }

  

  return (
    <div className="h-screen w-full  relative flex flex-col lg:flex-row">
      {/* Crimson Core Glow */}
      <div
        className="absolute inset-0 z-0 "
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
     <div className="w-full lg:w-80 border-r border-border flex flex-col h-auto lg:h-full relative z-10">
        {/* Header - Fixed */}
        <div className="p-3 sm:p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h1 className="text-lg sm:text-xl text-white font-bold">Toenail <span className="text-red-600">AI</span></h1>
            <UserButton />
          </div>
          
          {/* Token Display */}
          <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-white" />
              <span className="text-xs sm:text-sm font-medium text-white">Tokens</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg text-white font-bold">{token}</span>
              <Link to="/pricing" className='bg-black'>
                <Button variant="outline" size="sm" className='bg-black hover:bg-white/20'>
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-3 sm:p-4 text-white flex-shrink-0">
          <Button
            onClick={handleCreateChat}
            disabled={isCreatingChat }
            className="w-full text-sm sm:text-base"
            variant="hero"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            New Thumbnail Chat
          </Button>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-3 sm:p-4 space-y-2">
            {chats.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-white mx-auto mb-3 sm:mb-4" />
                <p className="text-white text-sm sm:text-base">No chats yet</p>
                <p className="text-xs sm:text-sm text-white">Create your first thumbnail!</p>
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
      <ScrollArea className="flex-1 flex flex-col w-full h-full lg:h-[90%] relative z-10">
        
        {selectedChatId ? (
          <ChatInterface chatId={selectedChatId} />
        ) : (
          <div className="flex-1 flex items-center text-white justify-center mt-5 sm:mt-10 md:mt-30 lg:mt-50 p-4">
            <div className="text-center max-w-md w-full">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Create Your First Thumbnail</h2>
              <p className="text-white mb-4 sm:mb-6 text-sm sm:text-base">
                Select a chat or create a new one to start generating amazing YouTube thumbnails with AI.
              </p>
              <Button onClick={handleCreateChat} variant="hero"  className="w-full sm:w-auto">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                Start Creating
              </Button>
            </div>
          </div>
        )}
      
      </ScrollArea>
    </div>
  );
}