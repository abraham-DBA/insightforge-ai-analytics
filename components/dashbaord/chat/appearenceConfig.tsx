import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Shield, Plus, X, Globe } from 'lucide-react'

interface ChatBotMetaData {
    id: string;
    user_email: string;
    color: string;
    welcome_message: string;
    allowed_domains: string[];
    created_at: string;
}

interface AppearenceConfigProps {
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    welcomeMessage: string;
    setWelcomeMessage: (msg: string) => void;
    allowedDomains: string[];
    setAllowedDomains: (domains: string[]) => void;
    isSaving: boolean;
    setIsSaving: (saving: boolean) => void;
    handleReset: () => void;
}

const AppearenceConfig = ({
    primaryColor,
    setPrimaryColor,
    welcomeMessage,
    setWelcomeMessage,
    allowedDomains,
    setAllowedDomains,
    isSaving,
    setIsSaving,
    handleReset
}: AppearenceConfigProps) => {
    const [domainInput, setDomainInput] = useState("");

    const handleAddDomain = () => {
        if (!domainInput.trim()) return;
        
        // Basic domain validation
        let domain = domainInput.trim().toLowerCase();
        domain = domain.replace(/^https?:\/\//, ''); // strip protocol
        domain = domain.split('/')[0]; // strip path
        
        if (allowedDomains.includes(domain)) {
            toast.error("Domain already added");
            return;
        }

        setAllowedDomains([...allowedDomains, domain]);
        setDomainInput("");
    };

    const handleRemoveDomain = (domain: string) => {
        setAllowedDomains(allowedDomains.filter(d => d !== domain));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const response = await fetch("/api/chatbot/metadata/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    color: primaryColor,
                    welcome_message: welcomeMessage,
                    allowed_domains: allowedDomains
                }),
            });

            if (response.ok) {
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
        <div className="bg-[#0A0A0E] border border-white/5 rounded-xl p-6 space-y-8 animate-in fade-in duration-500">
            <div>
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    Customization
                </h3>
                <p className="text-sm text-zinc-500 mt-1">Fine-tune your chatbot's look and initial behavior.</p>
            </div>

            <div className="space-y-6">
                {/* Visual Settings */}
                <div className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Primary Brand Color</label>
                        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-lg">
                            <input 
                                type="color" 
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-10 h-10 bg-transparent border-none cursor-pointer rounded overflow-hidden"
                            />
                            <span className="text-sm font-mono text-zinc-400 uppercase tracking-widest">{primaryColor}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Welcome Message</label>
                        <textarea 
                            value={welcomeMessage}
                            onChange={(e) => setWelcomeMessage(e.target.value)}
                            placeholder="Hi! How can I help you today?"
                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 min-h-[100px] transition-all resize-none placeholder:text-zinc-700"
                        />
                    </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Security Settings */}
                <div className="space-y-5">
                    <div className="flex items-center gap-2 text-white">
                        <Shield className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-sm font-medium">Domain Whitelisting</h4>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Security precaution: Only authorized domains will be able to load your widget. 
                        Leave empty to allow all domains (not recommended for production).
                    </p>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                            <input 
                                type="text"
                                value={domainInput}
                                onChange={(e) => setDomainInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDomain())}
                                placeholder="e.g. example.com"
                                className="w-full bg-white/[0.02] border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-700 font-mono"
                            />
                        </div>
                        <Button 
                            onClick={handleAddDomain}
                            variant="secondary" 
                            className="bg-white/5 border border-white/5 hover:bg-white/10 text-white transition-all h-[42px]"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {allowedDomains.length > 0 && (
                        <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1">
                            {allowedDomains.map(domain => (
                                <div 
                                    key={domain} 
                                    className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-1.5 rounded-full text-xs font-medium font-mono group"
                                >
                                    {domain}
                                    <button 
                                        onClick={() => handleRemoveDomain(domain)}
                                        className="text-indigo-400/50 hover:text-indigo-400 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-4">
                <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all font-semibold shadow-lg shadow-indigo-600/20 h-12 rounded-xl"
                    disabled={isSaving}
                    onClick={handleSave}
                > 
                    {isSaving ? (
                        <span className="flex items-center gap-2">
                             <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                             Processing...
                        </span>
                    ) : "Save Configuration"}
                </Button>
            </div>
        </div>
    )
}

export default AppearenceConfig