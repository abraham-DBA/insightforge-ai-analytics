import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  Copy, 
  Check, 
  Globe, 
  Layers, 
  MessageSquare, 
  Search, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  Clock,
  User,
  ArrowUpRight,
  FileText,
  Upload,
  Bot,
  Plus,
  CircleDashed,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DashboardData {
  botId: string | null;
  hasMetadata: boolean;
  knowledge: {
    website: number;
    upload: number;
    text: number;
    total: number;
  };
  sections: {
    total: number;
    list: Array<{
      name: string;
      sourceCount: number;
      tone: string;
    }>;
  };
  chats: Array<{
    title: string;
    snippet: string;
    time: string;
  }>;
  counts: {
    conversations: number;
    sections: number;
    knowledge: number;
  };
}

const DashboardOverview = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    const fetchData = async () => {
      try {
        const response = await fetch('/api/overview');
        const result = await response.json();
        if (response.ok) {
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyEmbedCode = () => {
    const code = `<script \n  src="${origin}/widget.js" \n  data-id="${data?.botId}" \n  defer\n></script>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-zinc-500 animate-pulse font-medium">Powering up InsightForge...</p>
        </div>
      </div>
    );
  }

  const setupSteps = [
    { label: "Website Scanned", completed: data?.hasMetadata, icon: Globe },
    { label: "Knowledge Added", completed: (data?.counts.knowledge || 0) > 0, icon: BookOpen },
    { label: "Sections Configured", completed: (data?.counts.sections || 0) > 0, icon: Layers },
    { label: "Widget Installed", completed: (data?.counts.conversations || 0) > 0, icon: Sparkles }
  ];

  return (
    <div className="flex-1 p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Dashboard
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">Welcome back to your AI command center.</p>
        </div>
      </div>

      {/* Setup Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {setupSteps.map((step, idx) => {
             const Icon = step.icon || Sparkles;
             return (
          <div key={idx} className={cn(
            "p-1 rounded-2xl transition-all duration-300",
            step.completed ? "bg-indigo-500/5 hover:bg-indigo-500/10" : "bg-white/[0.02] border border-white/5"
          )}>
            <div className="flex items-center gap-3 p-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                step.completed 
                    ? "bg-indigo-500 border-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]" 
                    : "bg-zinc-900 border-white/10 text-zinc-600"
              )}>
                {step.completed ? <Check className="w-5 h-5 text-white" /> : <Icon className="w-5 h-5" />}
              </div>
              <div className="flex flex-col">
                <span className={cn(
                    "text-xs font-semibold uppercase tracking-wider",
                    step.completed ? "text-indigo-400" : "text-zinc-600"
                )}>Step {idx + 1}</span>
                <span className={cn(
                    "text-sm font-medium",
                    step.completed ? "text-white" : "text-zinc-500"
                )}>{step.label}</span>
              </div>
            </div>
          </div>
        )})}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Knowledge & Sections */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Knowledge Stats */}
          <section className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    Knowledge Base Stats
                </h2>
                <Link href="/dashboard/knowledge">
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/5 gap-1 px-2 transition-colors">
                        Manage <ChevronRight className="w-4 h-4" />
                    </Button>
                </Link>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Web Sources", count: data?.knowledge.website, icon: Globe, color: "text-blue-400", bg: "bg-blue-400/10" },
                    { label: "Documents", count: data?.knowledge.upload, icon: FileText, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { label: "Custom Text", count: data?.knowledge.text, icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-400/10" }
                ].map((item, idx) => (
                    <Card key={idx} className="bg-[#0e0e12] border-white/5 hover:border-white/10 transition-colors">
                        <CardContent className="p-5 flex flex-col gap-3">
                            <div className={cn("p-2 rounded-lg w-fit", item.bg)}>
                                <item.icon className={cn("w-5 h-5", item.color)} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{item.count || 0}</p>
                                <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{item.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
             </div>
          </section>

          {/* Sections List */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-400" />
                    AI Sections
                </h2>
                <Link href="/dashboard/sections">
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/5 gap-1 px-2 transition-colors">
                        View All <ChevronRight className="w-4 h-4" />
                    </Button>
                </Link>
             </div>

             <div className="bg-[#0e0e12] rounded-2xl border border-white/5 overflow-hidden">
                {data?.sections.list && data.sections.list.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {data.sections.list.slice(0, 4).map((section, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-white/10">
                                        <Layers className="w-4 h-4 text-zinc-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{section.name}</p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" /> {section.sourceCount} Sources
                                            </span>
                                            <span className="text-[10px] bg-zinc-900 border border-white/5 px-1.5 py-0.5 rounded text-zinc-400 uppercase tracking-tighter">
                                                {section.tone}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-zinc-700" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-10 text-center space-y-3">
                        <Layers className="w-10 h-10 text-zinc-800 mx-auto" />
                        <p className="text-sm text-zinc-500">No sections configured yet.</p>
                        <Link href="/dashboard/sections">
                             <Button size="sm" variant="outline" className="h-8 border-white/10 hover:bg-white/5 text-xs">Create Section</Button>
                        </Link>
                    </div>
                )}
             </div>
          </section>
        </div>

        {/* Right Column - Recent Chats & Widget */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* Recent Conversations */}
           <section className="space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    Recent Activity
                </h2>
                <div className="bg-[#0e0e12] rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
                    {data?.chats && data.chats.length > 0 ? (
                        data.chats.map((chat, idx) => (
                            <div key={idx} className="p-4 flex items-start gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                                    <User className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-medium text-white truncate">{chat.title}</p>
                                        <span className="text-[10px] text-zinc-600 shrink-0 font-medium uppercase">{chat.time}</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{chat.snippet}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                         <div className="p-8 text-center opacity-40">
                             <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                             <p className="text-xs">Incoming chats will appear here</p>
                         </div>
                    )}
                </div>
                <Link href="/dashboard/conversations">
                    <Button variant="secondary" className="w-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 text-xs h-9 gap-1 transition-all border border-white/5">
                        View Inbox <ChevronRight className="w-3 h-3" />
                    </Button>
                </Link>
           </section>

           {/* Install Widget Card */}
           <Card className="bg-indigo-600/5 border-indigo-500/20 overflow-hidden relative group">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
                <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-md text-white font-semibold flex items-center gap-2">
                        <Bot className="w-5 h-5 text-indigo-400" />
                        Live Widget
                    </CardTitle>
                    <CardDescription className="text-zinc-500 text-xs">
                        Ready to go live? Copy the unique script below to embed the AI.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-2 space-y-4">
                    <div className="relative">
                        <pre className="text-[10px] p-4 rounded-xl bg-black/50 border border-white/5 text-zinc-400 overflow-x-auto font-mono scrollbar-hide line-clamp-4">
{`<script 
  src="${origin}/widget.js" 
  data-id="${data?.botId}" 
  defer
></script>`}
                        </pre>
                        <Button 
                            size="icon" 
                            variant="secondary" 
                            onClick={copyEmbedCode}
                            className="absolute top-2 right-2 h-7 w-7 bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                        >
                            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </Button>
                    </div>
                    <Link href="/dashboard/chatbot">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 py-5">
                            Test Simulation <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </CardContent>
           </Card>

        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;
