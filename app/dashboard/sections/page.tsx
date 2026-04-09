"use client"

import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import SectionFormFields from "@/components/dashbaord/sections/sectionFormFields";
import { toast } from 'sonner';
import SectionsTable from '@/components/dashbaord/sections/sectionsTable';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";


interface KnowledgeSource {
    id: string,
    name: string,
    type: SourceType,
    status: string
}

const INITIAL_FORM_DATA: SectionFormData = {
    name: "",
    description: "",
    tone: "neutral",
    allowedTopics: "",
    blockedTopics: "",
    fallbackBehaviour: "default"
}

const Page = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<Section | any>(null);
    const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([]);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [isLoadingSources, setIsLoadingSources] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [sections, setSections] = useState<Section[]>([])
    const [isLoadingSections, setIsLoadingSections] = useState(true)
    const [formData, setFormData] = useState<SectionFormData>(INITIAL_FORM_DATA)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

        useEffect(() => {
        fetchSections();
    }, [])

    const handleCreateSection = async () => {
        setSelectedSection({
            id: "new",
            name: "",
            description: "",
            sourceCount: 0,
            tone: "neutral",
            scopeLabel: "",
            status: "draft"
        })
        setSelectedSources([]);
        setFormData(INITIAL_FORM_DATA)
        setIsSheetOpen(true)

    }

    useEffect(() => {
        const fetchKnowledgeSources = async () => {
            try{
                const res = await fetch("/api/knowledge/fetch");
                const data = await res.json();
                setKnowledgeSources(data.sources || []);
            } catch (error) {
                console.error("Error fetching knowledge sources:", error);
            } finally {
                setIsLoadingSources(false);
            }
        }
        fetchKnowledgeSources()

    }, [])



    const fetchSections = async () => {
        try {
            setIsLoadingSections(true) 
            const res = await fetch("/api/section/fetch");
            const data = await res.json();
            
            // Access the 'response' array correctly
            const sectionsArray = data.response || [];
            
            const transformedSections: Section[] = sectionsArray.map((section: any) => ({
                id: section.id,
                name: section.name,
                description: section.description,
                sourceCount: section.source_ids?.length || 0,
                source_ids: section.source_ids || [],
                tone: section.tone as Tone,
                scopeLabel: section.allowed_topics || "General",
                allowedTopics: section.allowed_topics,
                blockedTopics: section.blocked_topics,
                status: section.status
            }))
            setSections(transformedSections)

        } catch (error) {
            console.error("Error fetching sections:", error);
            toast.error("Failed to fetch sections")
        } finally { 
            setIsLoadingSections(false);
        }
    }

    const handleSaveSection = async () => {
        if(!formData.name.trim()){
            toast.error("Please enter a name for the section name")
            return;
        } 

        if(formData.description.trim().length < 20){
            toast.error("Description must be at least 20 characters to help AI routing accuracy")
            return;
        }

        if(selectedSources.length === 0){
            toast.error("Please select at least one source")
            return;
        }

        setIsSaving(true)

       try {
        const sectionData = {
            ...formData,
            sourceIds: selectedSources,
            status: "active"
        };

        const response = await fetch("/api/section/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sectionData)
        });

        if(!response.ok){
            toast.error("Failed to create section")
            return;
        }

        await fetchSections();
        setIsSheetOpen(false);
        toast.success("Section created successfully")
        
       } catch (error) {
        console.error("Error creating section:", error);
        toast.error("Failed to create section")
        
       } finally {
        setIsSaving(false);
       }
    }

    const handleDeleteSection = async () => {
        setIsDeleteDialogOpen(true);
    }

    const handleConfirmDelete = async () => {
        if(!selectedSection || selectedSection.id === "new"){
            toast.error("No section selected")
            return;
        }

        try {
            setIsSaving(true)
            const response = await fetch(`/api/section/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: selectedSection.id })
            });

            if(!response.ok){
                toast.error("Failed to delete section")
                return;
            }

            await fetchSections();
            setIsDeleteDialogOpen(false);
            setIsSheetOpen(false);
            toast.success("Section deleted successfully")
            
        } catch (error) {
            console.error("Error deleting section:", error);
            toast.error("Failed to delete section")
            
        } finally {
            setIsSaving(false);
        }
    }

    const handlePreviewSection = (section: Section) => {
        setSelectedSection(section);
        setFormData({
            name: section.name,
            description: section.description,
            tone: section.tone,
            allowedTopics: section.allowedTopics || "",
            blockedTopics: section.blockedTopics || "",
            fallbackBehaviour: "escalate"
        })
        setSelectedSources(section.source_ids || []);
        setIsSheetOpen(true);
    }

    const isPreviewMode = selectedSection?.id !== "new"

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        Sections
                    </h1>
                    <p className="text-zinc-400 mt-1">
                        Define behavior and tone for your knowledge base.
                    </p>
                </div>
                <Button
                    onClick={handleCreateSection}
                    className="bg-white text-black hover:bg-zinc-200"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Section
                </Button>
            </div>

            <Card className="border-white/5 bg-[#0A0A0E]">
                <CardContent className="p-0">
                    <SectionsTable 
                        sections={sections}
                        isLoading={isLoadingSections}
                        onPreview={handlePreviewSection}
                        onCreateSection={handleCreateSection}
                    />

                </CardContent>

            </Card>

            <Sheet
                open={isSheetOpen}
                onOpenChange = {setIsSheetOpen}
            >
                <SheetContent className="w-full sm:max-w-xl border-l border-white/10 bg-[#0A0A0E] p-0 shadow-2xl flex flex-col h-full">
                    {selectedSection && (
                        <>
                            <SheetHeader className="p-6 border-b border-white/5">
                                <SheetTitle className="text-xl text-white">
                                    {selectedSection.id === "new"
                                        ? "Create Section"
                                        : "View Section"
                                    }

                                </SheetTitle>
                                <SheetDescription className="text-zinc-500">
                                    {selectedSection.id === "new"
                                        ? "Configure how the AI behaves for this specific topic"
                                        : "Review section configuration and data sources"
                                    }
                                </SheetDescription>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto px-6 py-0 space-y-8">
                                <SectionFormFields
                                    formData = {formData}
                                    setFormData = {setFormData}
                                    selectedSources = {selectedSources}
                                    setSelectedSources = {setSelectedSources}
                                    knowledgeSources = {knowledgeSources}
                                    isLoadingSources = {isLoadingSources}
                                    isDisabled = {isPreviewMode}
                                />

                            </div>

                            {selectedSection.id === "new" && (
                                <div className='p-6 border-t border-white/5'>
                                    <Button
                                    className='w-full bg-white text-black hover:bg-zinc-200'
                                        onClick={handleSaveSection}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? "Creating..." : "Create Section"}
                                    </Button>
                                </div>
                            )}

                            {selectedSection.id !== "new" && (
                                <div className="p-6 mt-auto border-t border-white/5 bg-red-500/[0.02]">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <h5 className="text-sm font-semibold text-red-500/90 flex items-center gap-2">
                                                Danger Zone
                                            </h5>
                                            <p className="text-xs text-zinc-500 mt-1">
                                                Permanently delete this section and all associated routing rules. This action cannot be undone.
                                            </p>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            className="w-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-none"
                                            onClick={handleDeleteSection}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? "Deleting..." : "Delete Section"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </SheetContent>


            </Sheet>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-[#0A0A0E] border-white/10 text-white max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete Section</DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            Are you sure you want to delete <span className="text-white font-medium">"{selectedSection?.name}"</span>? 
                            This action is permanent and cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 mt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="text-zinc-400 hover:text-white hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isSaving}
                            className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
                        >
                            {isSaving ? "Deleting..." : "Delete Section"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Page;