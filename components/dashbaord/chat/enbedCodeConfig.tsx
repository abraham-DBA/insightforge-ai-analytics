
import { Terminal, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const EmbedCodeConfig = ({ chatbotId }: { chatbotId?: string }) => {
  const [copied, setCopied] = useState(false);

  const embedCode = `<script src="https://insightforge.com/widget.js" data-id="${chatbotId}" defer></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success("Embed code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0A0A0E] border border-white/5 rounded-xl p-6 space-y-4">
      <div>
        <h3 className="text-base font-medium text-white">Embed Chatbot</h3>
        <p className="text-sm text-zinc-500 mt-1">
          Paste this script into the <code className="text-indigo-400 bg-indigo-500/10 px-1 rounded">&lt;head&gt;</code> of your website.
        </p>
      </div>

      <div className="relative group">
        <div className="bg-black/40 border border-white/5 rounded-lg overflow-hidden flex items-center">
          <pre className="flex-1 overflow-x-auto p-4 text-[13px] font-mono text-zinc-400 custom-scrollbar">
            <code>{embedCode}</code>
          </pre>
          <div className="p-2 border-l border-white/5 bg-white/5">
            <Button
              onClick={copyToClipboard}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Copy code"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedCodeConfig;

