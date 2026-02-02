import React from 'react';
import {Button} from "@/components/ui/button";
import {File, GlobeIcon, Upload} from "lucide-react";

const QuickActions = ({onOpenModal} : {onOpenModal: (tab:string) => void;}) => {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Button
                variant={"outline"}
                onClick={() => onOpenModal("website")}
                className="h-auto py-8 px-6 flex flex-col items-center justify-center gap-4 border-white/5 bg-[#0A0A03] hover:bg-white/5 hover:border-indigo-500/30 transition-all hover:text-white group whitespace-nowrap"
            >
                <div className="p-3 rounded-full bg-indigo-500/10 border border-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                    <GlobeIcon className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="space-y-1.5 text-center w-full">
                    <span className="text-xs font-medium block whitespace-normal">
                            Add Website
                    </span>
                    <p className="text-xs text-zinc-500 font-normal leading-relaxed whitespace-normal wrap-break-word">
                        Crawl your website or specific pages to automatically keep your knowledge base up to sync

                    </p>

                </div>

            </Button>

            <Button
                variant={"outline"}
                onClick={() => onOpenModal("upload")}
                className="h-auto py-8 px-6 flex flex-col items-center justify-center gap-4 border-white/5 bg-[#0A0A03] hover:bg-white/5 hover:border-emerald-500/30 transition-all hover:text-white group whitespace-nowrap"
            >
                <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                    <Upload className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="space-y-1.5 text-center w-full">
                    <span className="text-xs font-medium block whitespace-normal">
                            Upload File
                    </span>
                    <p className="text-xs text-zinc-500 font-normal leading-relaxed whitespace-normal wrap-break-word">
                        Upload CSV files to instantly populate your knowledge base with structured data.
                    </p>

                </div>
            </Button>

            <Button
                variant={"outline"}
                onClick={() => onOpenModal("text")}
                className="h-auto py-8 px-6 flex flex-col items-center justify-center gap-4 border-white/5 bg-[#0A0A03] hover:bg-white/5 hover:border-zinc-500/30 transition-all hover:text-white group whitespace-nowrap"
            >
                <div className="p-3 rounded-full bg-zinc-500/10 border border-zinc-500/10 group-hover:bg-zinc-500/20 transition-colors">
                    <File className="w-6 h-6 text-zinc-400" />
                </div>
                <div className="space-y-1.5 text-center w-full">
                    <span className="text-xs font-medium block whitespace-normal">
                            Add Website
                    </span>
                    <p className="text-xs text-zinc-500 font-normal leading-relaxed whitespace-normal wrap-break-word">
                        Manually copy-paste FAQs, internal notes or policies directly into the editor for quick updates

                    </p>

                </div>

            </Button>
        </div>
    );
};

export default QuickActions;