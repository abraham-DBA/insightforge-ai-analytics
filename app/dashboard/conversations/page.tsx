"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { AlertCircle, Loader2, MessageSquare, MoreHorizontal, Search, Send, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Conversation {
    id: string;
    user: string;
    lastMessage: string;
    time: string;
    email?: string;
    visitor_ip?: string;
}

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
}

const ConversationsPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [replyContent, setReplyContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const filteredConversations = conversations.filter(
    (c) => c.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/conversations");
        if (!response.ok) throw new Error("Failed to load conversations");
        const data = await response.json();
        setConversations(data.conversations || []);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally{
        setIsLoadingList(false);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedId) {
      const fetchMessages = async () => {
        try {
          setIsLoadingMessages(true);
          setError(null);
          const response = await fetch(`/api/conversations/${selectedId}/messages`);
          
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Failed to load messages");
          }
          
          const data = await response.json();
          setCurrentMessages(data.messages || []);
        } catch (err: any) {
          console.error("Error fetching messages:", err);
          setError(err.message);
        } finally {
          setIsLoadingMessages(false);
        }
      };
      fetchMessages();
    }
  }, [selectedId]);

  useEffect(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages,isLoadingMessages]);

  const handleSendReply = async () => {
    if(!replyContent.trim() || !selectedId) return;
    try {
      setIsSending(true);
      const response = await fetch(`/api/conversations/${selectedId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: replyContent }),
      });
      const newMesg: Message = {
        id: crypto.randomUUID(),
        content: replyContent,
        role: "assistant",
        createdAt: new Date().toISOString(),
      };
      setCurrentMessages((prev) => [...prev, newMesg]);
      setReplyContent("");

      setConversations((prev) => prev.map((c) => c.id === selectedId ? {...c, lastMessage: replyContent, time: "Just now"} : c))
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedId);

    return (
        <div className='flex h-[calc(100vh-64px)] overflow-hidden bg-black animate-in fade-in duration-500'>
          <div className='w-80 md:w-96 flex flex-col border-r border-white/5 bg-[#050509]'>
            <div className='p-4 border-b border-white/5 space-y-4'>
              <div className='flex items-center justify-between'>
                <h1 className='font-semibold text-white'>Inbox</h1>
                <div className='text-xs text-zinc-500'>
                  {filteredConversations.length} Conversations
                </div>
              </div>
              <div className='relative'>
                  <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500' />
                  <Input 
                    className='pl-9 bg-[#0a0a0e] border-white/10 text-sm '
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
              </div>
            </div>
            <ScrollArea className='flex-1'>
              <div className='flex flex-col'>
                {isLoadingList ? (
                  <div className='flex items-center justify-center py-10'>
                    <Loader2 className='w-6 h-6 animate-spin text-white' />
                  </div>
                  
                ) : (
                  filteredConversations.length === 0 ? (
                    <div className='text-center py-10 text-zinc-500 text-sm'>
                      No conversations found
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => 
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedId(conversation.id)}
                        className={cn(
                          "flex flex-col items-start gap-2 p-4 text-left transition-colors border-b border-white/5 hover:bg-white/2",
                          selectedId === conversation.id ? 
                          "bg-white/4 border-l-2 border-l-indigo-500 border-b-transparent" :
                           "border-l-2 border-l-transparent"
                        )}
                      >
                        <div className='flex w-full flex-col gap-1'>
                          <div className='flex items-center justify-between'>
                            <span
                              className={cn(
                                "font-medium text-sm truncate max-w-45",
                                selectedId === conversation.id ? "text-white" : "text-zinc-300"
                              )}
                            >
                              {conversation.user}
                              </span>
                              <span className='text-[10px] text-zinc-500 shrink-0'>
                                {conversation.time}
                              </span>
                          </div>
                            <span className='text-xs line-clamp-1 w-full text-zinc-500'>
                              {conversation.lastMessage}
                            </span>
                        </div>

                      </button>
                      
                    )
                  )
                  
                )}
              </div>


            </ScrollArea>
            
          </div>
          <div className='flex-1 flex flex-col min-w-0 bg-[#0a0a0e]'>
                {selectedConv ? (
                  <>
                    <div className='h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0e0e12]'>
                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center'>
                        <User className='w-4 h-4 text-zinc-400' />
                        </div>
                        <div>
                      
                      <div className='flex items-center gap-2'>
                        <h2 className='font-medium text-white text-sm'>
                          {selectedConv.user}
                        </h2>
                        {selectedConv.visitor_ip && (
                          <span className='text-xs text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded'>
                            {selectedConv.visitor_ip}
                          </span>
                        )}
                        </div>
                      </div>
                      </div>
                      <Button
                        variant="ghost"
                        size={"icon"}
                        className='h-8 w-8 text-zinc-400'
                      >
                        <MoreHorizontal className='w-4 h-4' />
                      </Button>
                    </div>

                    <ScrollArea className='flex-1 p-6'>
                      {isLoadingMessages ? (
                        <div className='flex items-center justify-center py-10'>
                          <Loader2 className='w-6 h-6 animate-spin text-zinc-500' />
                        </div>
                      ) : error ? (
                        <div className='flex flex-col items-center justify-center py-20 text-center gap-2'>
                          <div className='w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center'>
                            <AlertCircle className='w-6 h-6 text-red-500' />
                          </div>
                          <p className='text-red-500 font-medium'>{error}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedId(selectedId)}
                            className="text-zinc-500 hover:text-white"
                          >
                            Try again
                          </Button>
                        </div>
                      ) : currentMessages.length === 0 ? (
                        <div className='flex flex-col items-center justify-center py-20 text-center opacity-50'>
                          <MessageSquare className='w-10 h-10 mb-2' />
                          <p>No messages yet in this conversation.</p>
                        </div>
                      ) : (
                        <div className='max-w-3xl mx-auto space-y-6'>
                        {currentMessages.map((mesg) => (
                          <div key={mesg.id} className={cn(
                            "flex w-full gap-3",
                            mesg.role === "user" ? "flex-row-reverse" : "flex-row"
                          )}>
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                              mesg.role === "user" ? "bg-zinc-800" : "bg-indigo-600"
                            )}>
                              {mesg.role === "user" ? (
                                <User className="w-4 h-4 text-zinc-200" />
                              ) : (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 overflow-hidden">
                                  <Image src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="Support Agent" width={40} height={40} className="w-full h-full object-cover rounded-full" />
                                </div>
                              )}
                            </div>
                            <div 
                              className={cn(
                                "flex flex-col gap-1 max-w-[70%] break-words",
                                mesg.role === "user" ? "items-end" : "items-start"
                              )}
                            >
                              <div className={cn(
                                "p-3 rounded-lg text-sm leading-relaxed",
                                mesg.role === "user" 
                                ? "bg-zinc-800 text-zinc-100" 
                                : "bg-[#050509] border border-white/10 text-zinc-300 "
                              )}>
                                {mesg.content}
                              </div>
                              <span className='text-[10px] text-zinc-600 px-1'>
                                {mesg.createdAt
                                  ? new Date(mesg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
                                  : ""
                                }
                              </span>
                            </div>
                          </div>
                        ))}
                        <div ref={messageEndRef} />
                        </div>
                      )}
                    </ScrollArea>

                    <div className='p-6 border-t border-white/5 bg-[#0e0e12]'>
                        <div className='max-w-3xl mx-auto flex gap-3'>
                            <Input
                                placeholder="Type a message..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 bg-zinc-950 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-indigo-500/50"
                                disabled={isSending}
                            />
                            <Button 
                                onClick={handleSendReply}
                                disabled={isSending || !replyContent.trim()}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 px-6"
                            >
                                {isSending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <span>Send</span>
                                        <Send className='w-4 h-4' />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                  </>
                ) : (
                    <div className='flex-1 flex flex-col items-center justify-center text-zinc-500 gap-3'>
                        <div className='w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-2'>
                            <MessageSquare className='w-8 h-8 text-zinc-700' />
                        </div>
                        <h3 className='text-white font-medium'>No conversation selected</h3>
                        <p className='text-zinc-500 text-sm max-w-xs text-center'>Select a conversation from the sidebar to view the message history and reply.</p>
                    </div>
                )}
          </div>

        </div>
    );
};

export default ConversationsPage;