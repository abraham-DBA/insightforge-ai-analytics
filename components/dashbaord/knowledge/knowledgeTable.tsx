import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {File, FileText, Filter, Globe, Search, Upload} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Skeleton} from "@/components/ui/skeleton";
import {Badge} from "@/components/ui/badge";

interface knowledgeTableProps {
    sources: KnowledgeSource[],
    onSourceClick: (source: KnowledgeSource) => void,
    isLoading: boolean
}

export const getTypeIcon = (type: SourceType) => {
    switch (type) {
        case "website":
            return <Globe className="w-4 h-4 text-blue-400" />
        case "upload":
            return <Upload className="w-4 h-4 text-emerald-400" />
        case "text":
            return <File className="w-4 h-4 text-zinc-400" />
        case "docs":
            return <FileText className="w-4 h-4 text-sky-400" />
                default:
            return <File className="w-4 h-4 text-zinc-400" />
    }
}

const KnowledgeTable = ({sources, onSourceClick, isLoading} : knowledgeTableProps) => {
    return (
        <Card className="border border-white/5 bg-[#0A0A0E]">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium text-white">
                        Sources
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Input
                                className="h-9 w-52 md:w-72 bg-white/5 border-white/10 text-sm"
                                placeholder="Search Sources..."
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-400 hover:text-white hover:bg-white/5"
                        >
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-white/5 hover:bg-transparent">
                            <TableHead className="text-xs uppercase font-medium text-zinc-500">
                                Name
                            </TableHead>
                            <TableHead className="text-xs uppercase font-medium text-zinc-500">
                                Type
                            </TableHead>
                            <TableHead className="text-xs uppercase font-medium text-zinc-500">
                                Status
                            </TableHead>
                            <TableHead className="text-xs uppercase font-medium text-zinc-500">
                                LastUpdated
                            </TableHead>
                            <TableHead className="text-xs uppercase font-medium text-zinc-500">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow
                                    key={i}
                                    className="border-white/5 hover:bg-white/5"
                                >
                                    <TableCell className="py-4">
                                        <Skeleton className="h-5 w-32 bg-white/5 " />
                                    </TableCell>

                                    <TableCell>
                                        <Skeleton className="h-5 w-32 bg-white/5 " />
                                    </TableCell>

                                    <TableCell>
                                        <Skeleton className="h-5 w-32 bg-white/5 " />
                                    </TableCell>

                                    <TableCell>
                                        <Skeleton className="h-5 w-32 bg-white/5 " />
                                    </TableCell>

                                    <TableCell>
                                        <Skeleton className="h-5 w-32 bg-white/5 " />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : sources.length > 0 ? (
                            sources.map((source, index) =>
                                <TableRow
                                    key={source.id}
                                    className="border-white/5 hover:bg-white/5 cursor-pointer group transition-colors"
                                    onClick={() => onSourceClick(source)}
                                >
                                    <TableCell className="font-medium text-zinc-200 py-3 px-3 group-hover:text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="shrink-0">
                                                {getTypeIcon(source.type)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span>{source.name}</span>
                                                {source.source_url && (
                                                    <span className="text-xs text-zinc-500 font-normal">
                                                        {source.source_url}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-zinc-400 capitalize">
                                        {source.type}
                                    </TableCell>
                                    <TableCell className="text-zinc-400 capitalize">
                                        <Badge
                                            variant="outline"
                                            className={source.status === "active" ? "bg-emerald-500 text-white border-emerald-600" : "bg-zinc-500/10 text-zinc-500 border-white/10"}
                                        >
                                            {source.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-zinc-400">
                                        {source.last_updated_at ? new Date(source.last_updated_at).toLocaleDateString() : 'Never'}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-zinc-400 hover:text-white hover:bg-white/5"
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )

                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-32 text-center text-zinc-500"
                                >
                                    No knowledge sources yet
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>

            </CardContent>
        </Card>
    );
};

export default KnowledgeTable;