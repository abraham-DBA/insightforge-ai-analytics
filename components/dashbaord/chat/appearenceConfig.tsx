"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ChatBotMetaData {
    id: string;
    user_email: string;
    color: string;
    welcome_message: string;
    created_at: string;
    source_ids: string[];
}

interface AppearenceConfigProps {
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    welcomeMessage: string;
    setWelcomeMessage: (msg: string) => void;
    isSaving: boolean;
    setIsSaving: (saving: boolean) => void;
    handleReset: () => void;
}

const AppearenceConfig = ({
    primaryColor,
    setPrimaryColor,
    welcomeMessage,
    setWelcomeMessage,
    isSaving,
    setIsSaving,
    handleReset
}: AppearenceConfigProps) => {
    const [metadata, setMetadata] = useState<ChatBotMetaData | null>(null);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const response = await fetch("/api/chatbot/metadata/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    color: primaryColor,
                    welcome_message: welcomeMessage
                }),
            });

            if (response.ok) {
                const updatedMetadata = await response.json();
                setMetadata(updatedMetadata);
                toast.success("Configuration saved successfully");
            } else {
                toast.error("Failed to save configuration");
            }
        } catch (error) {
            console.error("Error saving configuration:", error);
            toast.error("An error occurred while saving");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="bg-[#0A0A0E] border border-white/5 rounded-xl p-6 space-y-6">
            <div>
                <h3 className="text-lg font-medium text-white">Customization</h3>
                <p className="text-sm text-zinc-500">Fine-tune your chatbot's look and initial behavior.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Primary Brand Color</label>
                    <div className="flex items-center gap-3">
                        <input 
                            type="color" 
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-10 h-10 bg-transparent border-none cursor-pointer"
                        />
                        <span className="text-sm font-mono text-zinc-500 uppercase">{primaryColor}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-zinc-400">Welcome Message</label>
                    <textarea 
                        value={welcomeMessage}
                        onChange={(e) => setWelcomeMessage(e.target.value)}
                        placeholder="Hi! How can I help you today?"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 min-h-[100px] resize-none"
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-white/5">
                <Button 
                    className="w-full bg-white text-zinc-950 hover:bg-zinc-200 transition-all font-medium shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    disabled={isSaving}
                    onClick={handleSave}
                > 
                    {isSaving ? "Saving..." : "Save Configuration"}
                </Button>
            </div>
        </div>
    )
}

export default AppearenceConfig