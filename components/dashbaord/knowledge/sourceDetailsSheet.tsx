"use client"

import React from "react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,

} from "@/components/ui/sheet"
import { getTypeIcon } from "@/components/dashbaord/knowledge/knowledgeTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface SourceDetailsSheetProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    selectedSource: KnowledgeSource | null
    onDisconnect?: (sourceId: string) => void
}

const SourceDetailsSheet = ({
                                isOpen,
                                setIsOpen,
                                selectedSource,
                                onDisconnect,
                            }: SourceDetailsSheetProps) => {
    if (!selectedSource) return null

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent
                side="right"
                style={{ width: 420, maxWidth: 420 }}
                className="flex flex-col border-white/10 bg-[#0A0A0E] p-0 shadow-2xl"
            >
                {/* HEADER */}
                <SheetHeader className="p-6 border-b border-white/5 space-y-2">
                    <SheetTitle className="text-xl text-white flex items-center gap-2 truncate">
                        {getTypeIcon(selectedSource.type)}
                        {selectedSource.name}
                    </SheetTitle>

                    <SheetDescription className="text-zinc-500 truncate">
                        {selectedSource.source_url || "manual entry"}
                    </SheetDescription>

                    <div className="flex items-center gap-2 pt-2">
                        <Badge
                            variant="outline"
                            className={
                                selectedSource.status === "active"
                                    ? "bg-emerald-500 text-white border-emerald-600"
                                    : "bg-zinc-500/10 text-zinc-500 border-white/10"
                            }
                        >
                            {selectedSource.status}
                        </Badge>
                        <span className="text-xs text-zinc-500">
              {selectedSource.last_updated_at
              ? `Updated ${new Date(selectedSource.last_updated_at).toLocaleDateString()}`
                  : "Never updated"}
                           </span>
                    </div>
                </SheetHeader>

                {/* SCROLLABLE CONTENT */}
                <div className="flex-1 p-6 overflow-hidden">
                    <div
                        style={{ maxWidth: 380, margin: "0 auto" }}
                        className="space-y-4 h-full flex flex-col"
                    >
                        <h4 className="text-sm font-medium text-zinc-300 uppercase tracking-wider">
                            Content Preview
                        </h4>

                        {/* Scrollable box */}
                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent hover:scrollbar-thumb-zinc-400 transition-colors duration-200 p-4 rounded-lg border border-white/5 bg-transparent font-mono text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">
                            {selectedSource.content ||
                                `# ${selectedSource.name}\n\n(No content available for preview.)`}
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <SheetFooter className="p-6 border-t border-white/10 bg-[#0A0A0E] flex-shrink-0">
                    <Button
                        variant="destructive"
                        className="w-full bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-200 transition-colors duration-200"
                        onClick={() => onDisconnect?.(selectedSource.id)}
                    >
                        Disconnect Source
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default SourceDetailsSheet
