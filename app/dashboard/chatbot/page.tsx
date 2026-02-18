"use client"

import ChatSimulator from '@/components/dashbaord/chat/chatSimulator';
import AppearenceConfig from '@/components/dashbaord/chat/appearenceConfig';
import { Button } from '@/components/ui/button';
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import EmbedCodeConfig from '@/components/dashbaord/chat/enbedCodeConfig';

// Types are already defined in @types/types.d.ts if needed elsewhere, 
// but local definition in AppearenceConfig is sufficient for now as per user request.

const ChatbotPage = () => {
    const [chatbotId, setChatbotId] = useState<string | undefined>(undefined);
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);

    const [messages, setMessages] = useState<any[]>([])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [activeSection, setActiveSection] = useState<string | null>(null)
    const scrollViewportRef = useRef<HTMLDivElement>(null)

    const [primaryColor, setPrimaryColor] = useState("#4f46e5")
    const [welcomeMessage, setWelcomeMessage] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const initPlayground = async () => {
          try {
            // Fetch Metadata
            const metaResponse = await fetch("/api/chatbot/metadata/fetch");
            const metaData = await metaResponse.json();
            
            if (metaData && !metaData.error) {
                setChatbotId(metaData.id);
                setPrimaryColor(metaData.color || "#4f46e5");
                const msg = metaData.welcome_message || "Hi! I'm your AI assistant. Which area would you like to explore today?";
                setWelcomeMessage(msg);
                
                setMessages([
                  {
                    role: "assistant",
                    content: msg,
                    isWelcome: true,
                    section: null
                  }
                ]);
            }

            // Fetch Sections
            const sectionResponse = await fetch("/api/section/fetch");
            if (sectionResponse.ok) {
                const sectionData = await sectionResponse.json();
                // Extract sections from the 'response' wrapper if it exists (my previous API version had it)
                const rawSections = sectionData.response || sectionData; 
                if (Array.isArray(rawSections)) {
                    setSections(rawSections.map((s: any) => ({
                        ...s,
                        sourceCount: s.source_ids?.length || 0,
                        scopeLabel: s.allowed_topics ? "Restricted" : "General"
                    })));
                }
            }
          } catch (error) {
            console.error("Error initializing chatbot playground:", error);
            toast.error("Failed to load playground data");
          } finally {
            setLoading(false);
          }
        };

        initPlayground();
    }, [])

    useEffect(() => {
      if(scrollViewportRef.current) {
        scrollViewportRef.current.scrollIntoView({behavior: "smooth"})
      }
        
    }, [messages, isTyping])

    const handleSend = async () => {
      if(!input.trim()) return;

      const currentSection = sections.find((s) => s.name === activeSection);
      const sourceIds = currentSection?.source_ids || [];

      const userMsg = { role: "user", content: input, section: activeSection};

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      try {
        const response = await fetch("/api/chat/test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMsg],
            knowledge_source_ids: sourceIds
          })
        })
        if(response.ok) {
          const data = await response.json();
          setMessages((prev) => [
            ...prev,
            {role: "assistant", content: data.response, section: null}
          ]);
          setIsTyping(false);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to get response from AI");
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now.", section: activeSection}]);
      } finally {
        setIsTyping(false);
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    const handleSectionClick = async (sectionName: string) => {
        setActiveSection(sectionName);
        const userMessage = {role: "user", content: sectionName, section: null}
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        // Mock bot response
        setTimeout(() => {
            const botMessage = { 
                role: 'assistant', 
                content: `You can ask me any question related to ${sectionName}`,
                section: sectionName 
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
        }, 1500);
    }

    const handleReset = () => {
        setActiveSection(null);
        setMessages([
            {
                role: "assistant",
                content: welcomeMessage,
                isWelcome: true,
                section: null
            }
        ]);
    }

    // hasChanges logic moved or simplified if needed elsewhere, 
    // but AppearenceConfig handles its own state now.

    if(loading) {
      return(
        <div className='p-8 text-zinc-500'>Loading chatbot configuration...</div>
      )
    }



    return (
        <div className='p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 h-[calc(100vh-64px)] overflow-hidden flex flex-col'>
            <div className='flex justify-between items-center shrink-0'>
                <div>
                    <h1 className='text-2xl font-semibold text-white tracking-tight'>
                        Chatbot Playground
                    </h1>
                    <p className='text-sm text-zinc-400 mt-1'>
                        Test your chatbot in real-time before you deploy it
                    </p>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0'>
              {/* Simulator Column */}
              <div className='lg:col-span-7 flex flex-col h-full min-h-0'>
                <ChatSimulator
                  messages={messages}
                  primaryColor={primaryColor}
                  sections={sections}
                  input={input}
                  setInput={setInput}
                  handleSend={handleSend}
                  handleKeyDown={handleKeyDown}
                  handleSectionClick={handleSectionClick}
                  activeSection={activeSection}
                  isTyping={isTyping}
                  handleReset={handleReset}
                  scrollRef={scrollViewportRef}
                />
              </div>

              {/* Settings Column */}
              <div className='lg:col-span-5 flex flex-col h-full overflow-y-auto space-y-6 pr-2 custom-scrollbar'>
                <AppearenceConfig 
                  primaryColor={primaryColor}
                  setPrimaryColor={setPrimaryColor}
                  welcomeMessage={welcomeMessage}
                  setWelcomeMessage={setWelcomeMessage}
                  isSaving={isSaving}
                  setIsSaving={setIsSaving}
                  handleReset={handleReset}
                />
                <EmbedCodeConfig chatbotId={chatbotId} />
              </div>
            </div>

            
        </div>
    );
};

export default ChatbotPage;