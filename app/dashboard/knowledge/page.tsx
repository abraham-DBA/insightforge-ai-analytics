"use client"

import React from 'react';
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import QuickActions from "@/components/dashbaord/knowledge/quickActions";
import AddKnowledgeModal from "@/components/dashbaord/knowledge/addKnowledgeModal";

const Page = () => {
    const [defaultTab, setDefaultTab] = React.useState("website");
    const [isAddOpen, setIsAddOpen] = React.useState(false);
    const [knowledgeStoringLoader, setKnowledgeStoringLoader] = React.useState(false);
    const [knowledgeSourcesLoader, setKnowledgeSourcesLoader] = React.useState(true);
    const [knowledgeSources, setKnowledgeSources] = React.useState<KnowledgeSource[]>([]);

    const openModal = (tab: string) => {
        setDefaultTab(tab);
        setIsAddOpen(true);
    }

    const handleImportSource = async (data: any) => {
        setKnowledgeStoringLoader(true);

        try {
            let response;

            if(data.type === "upload" && data.file) {
                const formData = new FormData();
                formData.append("type", "upload");
                formData.append("file", data.file);
                response = await fetch("/api/knowledge/store", {
                    method: "POST",
                    body: formData
                })

            }else {
                response = await fetch("/api/knowledge/store", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
            }
            if(!response.ok) throw new Error("Failed to store knowledge");

            const res = await fetch("/api/knowledge/fetch");
            const newData = await res.json();
            setKnowledgeSources(newData.sources);
            setIsAddOpen(false);

        } catch (error) {
            console.error(error);
        } finally {
            setKnowledgeSourcesLoader(false);
        }
    }
    return (
        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">
                        Knowledge Base
                    </h1>
                    <p className="text-sm text-zinc-400 mt-1">
                        Manage your website sources, documents, and uploads here
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => openModal("website")}
                        className="bg-white text-black hover:bg-zinc-200 transition-colors"
                    >
                        <PlusIcon className="w-4 h-4 mr-2"/>
                        Add Knowledge
                    </Button>

                </div>

            </div>

            {/*Quick actions */}
            <QuickActions onOpenModal={openModal}/>

            <AddKnowledgeModal
                isOpen={isAddOpen}
                setIsOpen={setIsAddOpen}
                defaultTab={defaultTab}
                setDefaultTab={setDefaultTab}
                onImport={handleImportSource}
                isLoading={knowledgeStoringLoader}
                existingSources={knowledgeSources}
            />

        </div>
    );
};

export default Page;