"use client"

import { AlertCircle, Bot, ChevronDown, MessageCircle, Send, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState, Suspense } from 'react'
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

interface ChatBotMetaData {
    id: string;
    color: string;
   welcome_message: string;
}

interface Section {
    id: string;
    name: string;
    source_ids: string[];
}

const ChatWidgetContent = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [metaData, setMetadata] = useState<ChatBotMetaData | null>(null)
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const scrollViewportRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOPen] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = "transparent";
        document.documentElement.style.backgroundColor = "transparent";

        if(typeof window !== "undefined") {
            window.parent.postMessage({
                type: "resize",
                width: "84px",
                height: "84px",
                borderRadius: "42px",
            }, "*")
        }
    }, []);

    const toggleWindow = () => {
        const newState = !isOpen;
        setIsOPen(newState);

        if(newState) {
                window.parent.postMessage({
                    type: "resize",
                    width: "400px",
                    height: "540px",
                    borderRadius: "24px",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                }, "*")
        } else {
            window.parent.postMessage({
                type: "resize",
                width: "84px",
                height: "84px",
                borderRadius: "42px",
            }, "*")
        } 
    };

    useEffect(() => {
        if(!token) {
            setError("Token is required");
            setLoading(false);
            return;
        }

        const fetchConfig = async () => {
            try {
                const res = await fetch(`/api/widget/config?token=${token}`);
                if(!res.ok) {
                    throw new Error("Failed to fetch widget config");
                }
                const data = await res.json();

                if(data.error) {
                    setError(data.error);
                    setLoading(false);
                    return;
                }
                setMetadata(data.metadata);
                setSections(data.sections || []);

                // initialize message 
                setMessages([
                    {
                        role: "assistant",
                        content: data.metadata.welcome_message || "Hello! How can I help you today?",
                        isWelcome: true,
                        section: null
                    }
                ])


            } catch (error) {
                console.error(error);
                setError("Failed to load widget")
            } finally {
                setLoading(false);
            }
        }
        fetchConfig();
    }, []);

    useEffect(() => {
        if(scrollViewportRef.current) {
            scrollViewportRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages, isTyping, isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    const handleSend = async () => {
        if(!input.trim() || !token) return;

        const currentSection = sections.find((s) => s.name === activeSection);
        const sectionId = currentSection?.source_ids || [];

        const userMessage = {role: "user", content: input, section: activeSection};
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch("/api/chat/public", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    knowledge_source_ids: sectionId,
                })
            });

            if(res.ok) {
                const data = await res.json();
                setMessages((prev) => [...prev, {role: "assistant", content: data.response, section: null}]);
            } else {
                setMessages((prev) => [...prev, {role: "assistant", content: "Sorry, I'm having trouble understanding you right now.", section: null}]);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to send message");
        } finally {
            setIsTyping(false);
        }
    }

    const handleSectionClick = (sectionName: string) => {
        setActiveSection(sectionName);
        const userMessage = {role: "user", content: sectionName,section: null}
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        window.setTimeout(() => {
            setIsTyping(false)
            const aiMessage = {
                role: "assistant",
                content: `Here's the information for ${sectionName}`,
                section: sectionName,
            };

            setMessages((prev) => [...prev, aiMessage]);
        }, 800);
    }

    const primaryColor = metaData?.color || "#4f46e5";

    if(loading) return null;

    if(error && isOpen) {
        return (
            <div className='flex flex-col items-center justify-center h-full bg-[#0e0e12]'>
                <AlertCircle className='w-10 h-10 mb-2' />
                <p>{error}</p>

            </div>
        )
    }

    if(!isOpen) {
        return (
            <div className='fixed bottom-2 right-2 w-[68px] h-[68px] flex items-center justify-center overflow-visible'>
                <button
                    onClick={toggleWindow}
                    className='group relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl hover:shadow-2xl'
                    style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                        boxShadow: `0 8px 16px -4px ${primaryColor}66`
                    }}
                >
                    {/* Ring animation */}
                    <div className='absolute -inset-1 rounded-full border-2 border-emerald-500/20 animate-ping [animation-duration:3s]' />
                    
                    <MessageCircle className='w-7 h-7 text-white transition-transform group-hover:rotate-12' />
                    
                    {/* Pulsing Status Dot */}
                    <div className='absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#121212] shadow-sm animate-pulse'></div>
                </button>
            </div>
        )
    }

  return (
    <div className='flex flex-col h-screen bg-[#0A0A0E] overflow-hidden rounded-xl border border-white/10 shadow-2xl'>
        <div className='h-16 border-b border-white/5 flex items-center justify-between px-4 bg-[#0e0e12]/80 backdrop-blur-md shadow-lg shrink-0 z-20'>
            <div className='flex items-center gap-3'>
                {/* Avatar with Status Indicator */}
                <div className='relative shrink-0'> 
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-zinc-800/50 overflow-hidden bg-zinc-900 shadow-inner">
                        <Image 
                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" 
                            alt="Support Agent" 
                            width={40} 
                            height={40} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div className='absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse'></div>
                </div>

                {/* Text Layout */}
                <div className='flex flex-col'>
                    <h1 className='text-sm font-bold text-white tracking-tight leading-tight'>Support</h1>
                    <div className='flex items-center gap-1'>
                        <span className='text-[11px] text-emerald-400 font-semibold uppercase tracking-wider'>Online</span>
                    </div>
                </div>
            </div>

            {/* Header Actions */}
            <div className='flex items-center gap-1'>
                <button
                    onClick={toggleWindow}
                    className='p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200'
                    aria-label='minimize chat'
                >
                    <ChevronDown className='w-5 h-5' />
                </button>
            </div>
        </div>

            <div className='flex-1 min-h-0 overflow-y-auto bg-zinc-950/30 p-4 scrollbar-thin scrollbar-thumb-white/10'>
                <div className='space-y-6 pb-4'>
                    {messages.map((message, i) => (
                        <div 
                        key={i}
                        className={cn("flex w-full flex-col", 
                            message.role === "user" ? "items-end" : "items-start"
                        )}
                        >
                            <div
                                className={cn("flex max-w-[85%] gap-3",
                                    message.role === "user"
                                    ? "flex-row-reverse" : "flex-row" 
                                )}
                            >
                                {message.role !== "user" && (
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 overflow-hidden">
                                        <Image src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="Support Agent" width={40} height={40} className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    
                                )}

                                <div className='space-y-2'>
                                    <div className={cn("p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm",
                                        message.role === "user"
                                        ? "bg-zinc-800 text-zinc-100 rounded-tr-sm"
                                        : "bg-white text-zinc-900 rounded-tl-sm"
                                    )}>
                                        {message.content}
                                    </div>
                                    {message.isWelcome && sections.length > 0 && (
                                        <div className='flex flex-wrap gap-2 pt-1 ml-1 animate-in fade-in slide-in-from-top-1 duration-300'>
                                            {sections.map((section) => (
                                                <button
                                                    key={section.id}
                                                    onClick={() => handleSectionClick(section.name)}
                                                    className='px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 hover:border-zinc-600 text-zinc-300 text-xs font-medium transition-all'
                                                >
                                                    {section.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className='flex w-full justify-start'>
                            <div className='flex max-w-[85%] gap-3 flex-row'>
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 overflow-hidden">
                                        <Image src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="Support Agent" width={40} height={40} className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0e0e12] rounded-full'></div>
                                    <div className='p-4 rounded-full bg-white text-zinc-900 rounded-tl-sm shadow flex items-center gap-1'>
                                        <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                                    </div>

                            </div>
                            </div>
                    )}
                    <div ref={scrollViewportRef} />

                    </div>
                </div>
                <div className='p-4 bg-[#0a0a0e] border-t border-white/5 shrink-0 z-0'>
                <div className='relative'>
                    <Textarea
                        value = {input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled= {!activeSection}
                        placeholder={
                            activeSection ? "Type a question..." : "Select a topic above"
                        }
                        className='min-h-12 max-h-30 pr-12 outline-none text-white bg-zinc-900/50 border-white/10 resize-none rounded-xl disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-zinc-600 focus:ring-1 focus:ring-white/20'
                    />
                    <Button
                    onClick={handleSend}
                    size="icon"
                    disabled={!activeSection || !input.trim()}
                    className={cn(
                        "absolute right-2 bottom-2 h-8 w-8 rounded-lg transition-all",
                        (!activeSection || !input.trim()) ? "opacity-30 cursor-not-allowed" : "hover:scale-105 active:scale-95 shadow-lg"
                    )}
                    style={{ backgroundColor: primaryColor, color: "#fff" }}
                 >
                    <Send className="w-4 h-4" />
                 </Button>
                </div>

                    <div className='mt-2 text-center'>
                        <Link href="/" className='text-[10px] text-zinc-600 font-medium hover:text-zinc-600 transition-colors'>
                            Powered by InsightForge
                        </Link>

                    </div>
                </div>
            </div>
  )
}

const EmbedPage = () => {
    return (
        <Suspense fallback={null}>
            <ChatWidgetContent />
        </Suspense>
    )
}

export default EmbedPage
