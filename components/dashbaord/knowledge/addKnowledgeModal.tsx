import React from 'react';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {AlertCircle, FileText, Globe, Loader2, Upload} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";

interface addKnowledgeModalProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    defaultTab: string;
    setDefaultTab: (tab: string) => void;
    onImport: (data: any) => Promise<void>;
    isLoading: boolean;
    existingSources: KnowledgeSource[];
}

const AddKnowledgeModal = ({isOpen, setIsOpen, defaultTab, setDefaultTab, onImport, isLoading, existingSources}: addKnowledgeModalProps) => {
    const [websiteUrl, setWebsiteUrl] = React.useState("");
    const [docsTitle, setDocsTitle] = React.useState("");
    const [docsContent, setDocsContent] = React.useState("");
    const [uploadedFiles, setUploadedFiles] = React.useState<File |null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const validateUrl = (url: string) => {
        try {
            const parsed = new URL(url);
            return ["https:", "http:"].includes(parsed.protocol);
        } catch {
            return false;
        }
    }

    const handleImportWrapper = async () => {
        setError(null);
        const data:any = {type: defaultTab}

        if(defaultTab === "website"){
            if(!websiteUrl) {
                setError("Please enter a website URL");
                return;
            }
            if(!validateUrl(websiteUrl)) {
                setError("Please enter a valid website URL");
                return;
            }

            const normalizedInput = websiteUrl.replace(/\/+$/, "");

            const exists = existingSources.some((source) => {
                if(source.type !== "website" || !source.source_url) return false;
                const normalizeSource = source.source_url.replace(/\/+$/, "");
                return normalizeSource === normalizedInput;
            });

            if(exists) {
                setError("This website has already been added");
                return;
            }
            data.url = websiteUrl;
        } else if(defaultTab === "text"){
            if(!docsTitle.trim()) {
                setError("Please enter a title");
                return;
            }
            data.title = docsTitle;
            data.content = docsContent;
        }else if(defaultTab === "upload"){
            if(!uploadedFiles) {
                setError("Please upload a CSV file");
                return;
            }
            data.file = uploadedFiles;
        }

        await onImport(data);

        setWebsiteUrl("");
        setDocsTitle("");
        setDocsContent("");
        setUploadedFiles(null);
        setError(null);

    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) setError(null);
            }}
        >
            <DialogContent className="sm:max-w-150 bg-[#0E0E12] border-white/10 text-zinc-100 p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Add new Source</DialogTitle>
                    <DialogDescription>
                        Choose a content type to train your assistant
                    </DialogDescription>
                </DialogHeader>
                <Tabs
                defaultValue={"website"}
                value={defaultTab}
                onValueChange={(value) => {
                    setDefaultTab(value)
                    setError(null);
                }}
                className="w-full"
                >
                    <div className="px-6 border-b border-white/5">
                        <TabsList className="bg-transparent h-auto p-0 gap-6">
                            <TabsTrigger
                                value={"website"}
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-0 py-3 text-xs uppercase tracking-wider text-zinc-500 hover:text-white data-[state=active]:text-white transition-all focus-visible:ring-0 focus:outline-none border-t-0 border-x-0">
                                Website
                            </TabsTrigger>

                            <TabsTrigger
                                value="text"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-0 py-3 text-xs uppercase tracking-wider text-zinc-500 hover:text-white data-[state=active]:text-white transition-all focus-visible:ring-0 focus:outline-none border-t-0 border-x-0"
                            >
                                Q&A/ Text
                            </TabsTrigger>

                            <TabsTrigger
                                value="upload"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-0 py-3 text-xs uppercase tracking-wider text-zinc-500 hover:text-white data-[state=active]:text-white transition-all focus-visible:ring-0 focus:outline-none border-t-0 border-x-0"
                            >
                                File Upload
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <div className="p-6 min-h-50 space-y-4">
                        {error && (
                            <Alert
                                variant="destructive"
                                className="bg-red-500/10 border-red-500/20 text-red-400 py-2"
                            >
                                <AlertCircle className="h4 w-4" />
                                <AlertDescription className="ml-2 text-xs">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        <TabsContent
                            value="website"
                            className="mt-0 space-y-4 animate-in fade-in duration-300"
                        >
                            <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-sm flex gap-3">
                                <Globe className="w-5 h-5 shrink-0" />
                                <p className="font-medium">Crawl your website</p>
                                <p className="text-xs text-indigo-300/80 mt-1 leading-relaxed ">
                                    Enter a website url to crawl significantly or add a specific page link to provide focused context
                                </p>
                            </div>
                            <div className="space-y-3">
                                <Label>Website URL</Label>
                                <Input
                                    placeholder="https://example.com"
                                    className="bg-white/5 border-white/5 mt-1"
                                    value={websiteUrl}
                                    onChange={(e) => {
                                        setWebsiteUrl(e.target.value);
                                        if(error) setError(null);
                                    }}
                                />


                            </div>
                        </TabsContent>

                        <TabsContent
                            value={"text"}
                            className="mt-0 space-y-4 animate-in fade-in duration-300"
                        >
                            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-200 text-sm flex gap-3">
                                <FileText className="w-5 h-5 shrink-0" />
                                <p className="font-medium">Raw Text</p>
                                <p className="text-xs text-purple-300/80 mt-1 leading-relaxed ">
                                    Paste existing FAQs, policies, internal notes directly
                                </p>
                            </div>
                            <div className="space-y-3">
                                <Label>Title</Label>
                                <Input
                                    placeholder="e.g. Refund Policies"
                                    className="bg-white/5 border-white/10 mt-1"
                                    value={docsTitle}
                                    onChange={(e) => setDocsTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label>Content</Label>
                                <Textarea
                                    placeholder="Paste text here..."
                                    className="bg-white/5 border-white/10 mt-1 h-32 resize-none"
                                    value={docsContent}
                                    onChange={(e) => setDocsContent(e.target.value)}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent
                            value={"upload"}
                            className="mt-0 space-y-4 animate-in fade-in duration-300"
                        >
                            <input
                                type="file"
                                id={"csv-file-input"}
                                accept=".csv,text/csv"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if(file){
                                        if(file.size > 10 * 1024 * 1024) {
                                            setError("File size must be less than 10MB");
                                            return;
                                        }
                                        if(
                                            !file.name.endsWith(".csv") &&
                                            file.type !== "text/csv"
                                        ) {
                                            setError("File must be a CSV file");
                                            return;
                                        }
                                        setUploadedFiles(file);
                                        setError(null);
                                    }
                                }}
                            />
                            <div
                                className="border-2 border-dashed border-white/10 rounded-xl h-60
               flex flex-col items-center justify-center gap-3
               cursor-pointer text-center
               hover:border-indigo-500/40 hover:bg-white/5
               transition-all duration-200"
                                onClick={() => {
                                    document.getElementById("csv-file-input")?.click();
                                }}
                            >
                                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                                    <Upload className="w-6 h-6 text-zinc-400" />
                                </div>

                                <p className="text-sm font-medium text-white">
                                    {uploadedFiles
                                        ? uploadedFiles.name
                                        : "Click to upload or drag and drop"}
                                </p>

                                <p className="text-xs text-zinc-500">CSV (max 10mb)</p>
                            </div>

                        </TabsContent>
                        <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-400 hover:text-white hover:bg-white/5"
                            >
                                Cancel
                            </Button>

                            <Button
                                className={`bg-white  text-black hover:bg-zinc-200 ${
                                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                onClick={handleImportWrapper}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                ) : (
                                    "Import Source"
                                )}
                            </Button>

                        </div>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default AddKnowledgeModal;