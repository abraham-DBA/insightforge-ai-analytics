import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, RefreshCw, Send, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";


interface ChatSimulatorProps {
    messages: any[];
    primaryColor: string;
    sections: Section[]; 
    input: string;
    setInput: (val: string) => void;
    handleSend: () => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    handleSectionClick: (name: string) => void;
    activeSection: string | null;
    isTyping: boolean;
    handleReset: () => void;
    scrollRef: React.RefObject<HTMLDivElement | null>;
}

const ChatSimulator = ({
    messages,
    primaryColor,
    sections,
    input, 
    setInput,
    handleSend,
    handleKeyDown,
    handleSectionClick,
    activeSection,
    isTyping,
    handleReset,
    scrollRef
} : ChatSimulatorProps) => {
  return (
    <Card className='flex-1 flex flex-col border-white/5 bg-[#0A0A0E] overflow-hidden relative shadow-2xl rounded-xl'>
        {/* Header */}
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0E0E12]">
            <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-zinc-300">
                    Test Environment
                </span>
            </div>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
            >
                <RefreshCw className="w-3.5 h-3.5 mr-2" />
                Reset
            </Button>
        </div>

        {/* Message Area */}
        <ScrollArea className='flex-1 relative bg-zinc-950/30'>
            <div className="p-6 space-y-6 pb-4">
                {messages.map((msg, i) => {
                    if (msg.role === "system") {
                        return (
                            <div key={i} className="flex justify-center py-2">
                                <span className="bg-white/5 border border-white/5 px-3 py-1 rounded-full text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                                    {msg.content}
                                </span>
                            </div>
                        )
                    }

                    return (
                        <div key={i} className={cn("flex w-full flex-col", msg.role === "user" ? "items-end" : "items-start")}>
                            <div className={cn("flex max-w-[85%] gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                                {/* Avatar */}
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 shadow-inner", 
                                    msg.role === "user" ? "bg-zinc-800" : "bg-white"
                                    )}
                                    style={msg.role !== "user" ? { backgroundColor: primaryColor } : {}}
                                >
                                    {msg.role === "user" ? (
                                        <User className="w-4 h-4 text-zinc-400" />
                                    ) : (
                                        <Bot className="w-4 h-4 text-white" />
                                    )}
                                </div>
        
                                {/* Content */}
                                <div className={cn("space-y-2 flex flex-col", msg.role === "user" ? "items-end" : "items-start")}>
                                    <div className={cn(
                                        "px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm transition-all",
                                        msg.role === "user" 
                                        ? "bg-zinc-800 text-zinc-100 rounded-tr-sm border border-white/5" 
                                        : "bg-white text-zinc-900 rounded-tl-sm font-medium"
                                    )}>
                                        {msg.content}
                                    </div>
        
                                    {/* Section Buttons */}
                                    {msg.isWelcome && sections.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-1 animate-in fade-in slide-in-from-top-2 duration-500">
                                            {sections.map((section) => (
                                                <button
                                                    key={section.id}
                                                    onClick={() => handleSectionClick(section.name)}
                                                    className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-[12px] font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                                                >
                                                    {section.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}

                {isTyping && (
                     <div className="flex w-full justify-start">
                        <div className="flex max-w-[80%] gap-3 flex-row">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-white/5 border"
                                style={{backgroundColor: primaryColor}}
                            >
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="p-4 rounded-2xl bg-white text-zinc-900 rounded-tl-sm shadow-sm flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                            </div>
                        </div>
                     </div>
                )}
                <div ref={scrollRef} />
            </div>

        </ScrollArea>
       
        {/* Input Area */}
        <div className="p-4 bg-[#0A0A0E] border-t border-white/5">
            <div className="relative">
                 <Textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={!activeSection}
                    placeholder={
                        activeSection ? "Type a message..." : "Select a section to start chatting"
                    }
                    className="min-h-[50px] max-h-[150px] pr-12 outline-none text-white bg-zinc-900/50 border-white/10 resize-none rounded-xl disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-1 focus-visible:ring-white/10"    
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
        </div>
    </Card>
  )
}

export default ChatSimulator