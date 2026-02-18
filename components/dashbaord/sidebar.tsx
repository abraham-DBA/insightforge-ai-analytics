"use client";

import React, { useEffect, useState } from "react";
import {
    BookOpen,
    Bot,
    Layers,
    LayoutDashboard,
    MessageSquare,
    Settings,
} from "lucide-react";
import { usePathname } from "next/dist/client/components/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";

export const SIDEBAR_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Knowledge", href: "/dashboard/knowledge", icon: BookOpen },
    { label: "Sections", href: "/dashboard/sections", icon: Layers },
    { label: "Chatbot", href: "/dashboard/chatbot", icon: Bot },
    { label: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const Sidebar = () => {
    const pathname = usePathname();
    const { email } = useUser();
    const [metadata, setMetadata] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMetadata = async () => {
            const response = await fetch("/api/metadata/fetch");
            const res = await response.json();
            setMetadata(res.data);
            setIsLoading(false);
        };
        fetchMetadata();
    }, []);

    return (
        <div className="w-64 border-r border-white/5 bg-[#050509] flex-col h-screen fixed left-0 top-0 z-40 hidden md:flex">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="relative w-7 h-7 rounded-md bg-white flex items-center justify-center">
                        <div className="w-[3px] h-4 bg-black rounded-full" />
                    </div>
                    <span className="text-base font-semibold tracking-tight text-white">
            Insight<span className="text-white/60">Forge</span>
          </span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {SIDEBAR_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-white/5 text-white"
                                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Profile */}
            <div className="shrink-0 mt-auto border-t border-white/5 p-4">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
            <span className="text-xs text-zinc-400 group-hover:text-white">
              {metadata?.business_name?.slice(0, 2).toUpperCase() || ".."}
            </span>
                    </div>
                    <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium text-zinc-300 truncate group-hover:text-white">
              {isLoading
                  ? "Loading..."
                  : metadata?.business_name
                      ? `${metadata.business_name}'s Workspace`
                      : "Workspace"}
            </span>
                        <span className="text-xs text-zinc-400 truncate">{email}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;