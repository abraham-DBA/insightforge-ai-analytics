import React from 'react';
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {FileText, X} from "lucide-react";

interface KnowledgeSource {
    id: string,
    name: string,
    type: string,
}

interface SectionFieldFormProps {
    formData: SectionFormData,
    setFormData: (data: SectionFormData) => void,
    selectedSources: string[],
    setSelectedSources: (sources: string[]) => void,
    knowledgeSources: KnowledgeSource[],
    isLoadingSources: boolean,
    isDisabled: boolean,
}

const TONE_OPTIONS = [
    {
        value: "strict",
        label: "Strict",
        badge: "Fact-based",
        description: "Only answer if fully confident. No small talk."
    },
    {
        value: "neutral",
        label: "Neutral",
        description: "Professional, concise, and direct"
    },
    {
        value: "friendly",
        label: "Friendly",
        description: "Friendly, helpful, and polite"
    },
    {
        value: "empathetic",
        label: "Empathetic",
        description: "Support-first, kind, and welcoming"
    }
]

const SectionFormFields = ({
    formData,
    setFormData,
    selectedSources,
    setSelectedSources,
    knowledgeSources,
    isLoadingSources,
    isDisabled,
                           } : SectionFieldFormProps) => {
    return (
        <>
            <div className="space-y-4">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Basics
                </h4>
                <div className="space-y-2">
                    <Label htmlFor="section-name" className="text-zinc-500">
                        Section Name
                    </Label>
                    <Input
                        id="section-name"
                        placeholder="e.g. Billing Policy"
                        className="bg-white/2 border-white/10 text-white placeholder:text-zinc-600"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={isDisabled}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="section-description" className="text-zinc-500">
                        Description
                    </Label>
                    <Input
                        id="section-description"
                        placeholder="When should the ai use this?"
                        className="bg-white/2 border-white/10 text-white placeholder:text-zinc-600"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        disabled={isDisabled}
                    />
                    <p className="text-[11px] text-zinc-500">
                        Used by the routing model to decide when to activate this section.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                            Data Source
                        </h4>
                        <span className="text-xs text-zinc-500">
                            {selectedSources.length} attached
                        </span>
                    </div>

                    <Select
                        value={selectedSources[0] || ""}
                        onValueChange={(value) =>{
                            if (!selectedSources.includes(value)) {
                                setSelectedSources([...selectedSources, value])
                            }
                        }}
                        disabled={isDisabled}
                    >
                        <SelectTrigger className="bg-white/2 border-white/10 text-white ">
                            <SelectValue
                                placeholder={
                                isLoadingSources
                                    ? "Loading..."
                                    : "Select a data source"
                                }
                            />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0A0A0E] border-white/10 text-zinc-500">
                            {knowledgeSources.length > 0 ? (
                                knowledgeSources.map((source) => (
                                    <SelectItem key={source.id} value={source.id}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-zinc-500 capitalize">
                                                [{source.type}]
                                            </span>
                                            <span>{source.name}</span>
                                        </div>
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="none">No data sources available</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    {selectedSources.length > 0 && (
                        <div className="grid grid-cols-1 gap-2">
                            {selectedSources.map((sourceId) => {
                                const source = knowledgeSources.find((source) => source.id === sourceId);
                                if(!source) return null;
                                return (
                                    <div 
                                        key={sourceId} 
                                        className="group flex items-center justify-between p-3.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-md bg-zinc-800/50 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
                                                <FileText className="size-4 text-zinc-500" />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-zinc-200 font-medium">
                                                        {source.name}
                                                    </span>
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-white/5 font-semibold uppercase tracking-wider">
                                                        {source.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-7 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                            onClick={() => setSelectedSources(selectedSources.filter((id) => id !== sourceId))}
                                            disabled={isDisabled}
                                        >
                                            <X className="size-3.5" />
                                        </Button>

                                    </div>
                                )
                            })}

                        </div>

                    )}

                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        Tone
                    </h4>
                    <RadioGroup
                        value={formData.tone}
                        onValueChange={(value) =>
                            setFormData({...formData, tone: value as Tone})
                        }
                        className="grid grid-cols-1 gap-3"
                        disabled={isDisabled}
                    >
                        {TONE_OPTIONS.map((option) => (
                            <div
                                key={option.value}
                                className={`group relative flex items-start gap-4 rounded-lg border p-4 transition-all duration-200 cursor-pointer ${
                                    formData.tone === option.value 
                                    ? "border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.05)]" 
                                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10"
                                }`}
                                onClick={() => !isDisabled && setFormData({...formData, tone: option.value as Tone})}
                            >
                                <div className="mt-0.5 flex items-center justify-center">
                                    <RadioGroupItem
                                        value={option.value}
                                        id={option.value}
                                        className="size-4.5 border-zinc-700 text-indigo-500 focus-visible:ring-indigo-500/20"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1.5">
                                    <div className="flex items-center gap-4">
                                        <Label
                                            htmlFor={option.value}
                                            className="text-sm font-semibold text-zinc-100 cursor-pointer"
                                        >
                                            {option.label}
                                        </Label>
                                        {option.badge && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/15 uppercase tracking-tighter">
                                                {option.badge}
                                            </span>
                                        )}
                                    </div>
                                    <span className='text-xs text-zinc-500 font-normal'>
                                        {option.description}
                                    </span>
                                </div>
                                {formData.tone === option.value && (
                                    <div className="absolute top-2 right-2">
                                        <div className="size-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                
                <div className='space-y-4'>
                    <h4 className='text-xs font-semibold text-zinc-500 uppercase tracking-wider'>
                        Scope Rules
                    </h4>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <Label htmlFor="allowed-topics" className='text-zinc-300 text-xs'>
                                Allowed Topics
                            </Label>
                            <Input
                                id="allowed-topics"
                                className='bg-white/2 border-white/10 text-white'
                                placeholder='eg competitors'
                                value={formData.allowedTopics}
                                onChange={(e) => setFormData({...formData, allowedTopics: e.target.value})}
                                disabled={isDisabled}
                            />

                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor="blocked-topics" className='text-zinc-300 text-xs'>
                                Blocked Topics
                            </Label>
                            <Input
                                id="blocked-topics"
                                className='bg-white/2 border-white/10 text-white'
                                placeholder='eg competitors'
                                value={formData.blockedTopics}
                                onChange={(e) => setFormData({...formData, blockedTopics: e.target.value})}
                                disabled={isDisabled}
                            />

                        </div>


                    </div>

                </div>
            </div>
            
        </>
    );
};

export default SectionFormFields;