"use client";

import {ArrowRight, Building2, ChevronLeft, Command, Globe, LinkIcon, Sparkles} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";

interface initialData {
    businessName: string;
    websiteURL: string;
    externalLinks: string;
}

const STEPS = [
    {
        id: "name",
        label: "Business Name",
        question: "What is the name of your organization?",
        description: "This name will be used to personalize your InsightForge workspace.",
        icon: Building2,
        placeholder: "e.g. Acme Corp",
        type: "text",
        field: "businessName" as keyof initialData,
    },
    {
        id: "website",
        label: "Primary Website",
        question: "What is your primary website URL?",
        description: "InsightForge will ingest approved content from this source to build structured knowledge.",
        icon: Globe,
        placeholder: "e.g. https://www.acme.com",
        type: "url",
        field: "websiteURL" as keyof initialData,
    },
    {
        id: "links",
        label: "Additional Sources",
        question: "Do you have any additional sources to include?",
        description: "Optional links such as documentation, Notion pages, or help centers can be added for deeper context.",
        icon: LinkIcon,
        placeholder: "e.g. https://docs.example.com",
        type: "text",
        badge: "optional",
        field: "externalLinks" as keyof initialData,
    },
];

const InitialForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<initialData>({
        businessName: "",
        websiteURL: "",
        externalLinks: "",
    });

    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

    const progress = ((currentStep + 1) / STEPS.length) * 100;
    const stepData = STEPS[currentStep];
    const Icon = stepData.icon;

    useEffect(() => {
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 300);
    }, [currentStep]);

    const handleNext = () => {
        if (isSubmitting || isAnimating) return;
        const currentField = STEPS[currentStep].field;
        const value = (formData[currentField] ?? "").toString();

        // allow optional steps to be empty
        if (STEPS[currentStep].badge !== "optional" && value.trim() === "") return;

        if (currentStep < STEPS.length - 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep((prev) => prev + 1);
                setIsAnimating(false);
            }, 300);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (isAnimating) return;
        if (currentStep > 0) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep((prev) => prev - 1);
                setIsAnimating(false);
            }, 300);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (STEPS[currentStep].type === "textarea") {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleNext();
            }
            return;
        }
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleNext();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/metadata/store", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    business_name: formData.businessName,
                    website_url: formData.websiteURL,
                    external_links: formData.externalLinks,
                }),
            });
            if (!response.ok) {
                return;
            }
            await response.json();
            window.location.reload();
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentValue = (formData[stepData.field] ?? "").toString();
    const isStepValid = stepData.badge === "optional" || currentValue.trim() !== "";

    return (
        <>
            <div className="w-full max-w-xl mx-auto min-h-screen flex flex-col justify-center">
                {
                    isSubmitting ? (
                        <div className="flex flex-col items-center justify-center text-center animate-in fade-in fade-out duration-700">
                            <div className="relative mb-8">
                                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse">
                                    <div className="relative w-16 h-16 bg-linear-to-tr from text-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                        <Sparkles className="w-8 h-8 text-white animate-bounce" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-medium text-white mb-2">
                                    Storing your organization's info
                                </h2>
                                <p className="text-zinc-500">
                                    Scanning {formData.websiteURL} for structured knowledge...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className={cn("transition-all duration-300 ease-in-out transform",
                            isAnimating ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"
                        )}>
                            {/* Progress bar moved here */}
                            <div className="w-full h-1 bg-zinc-800 mb-4">
                                <div
                                    className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    {
                                        currentStep > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleBack}
                                                className="text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-full ml-2 w-8 h-8"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </Button>
                                        )
                                    }
                                    <span className="text-xs font-medium text-indigo-400 uppercase tracking-widest">
                                         step {currentStep + 1} of {STEPS.length}
                                     </span>
                                </div>
                                {/* Setup text moved here */}
                                <div className="text-xs font-medium text-zinc-600 uppercase tracking-widest">
                                    Setup your account
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h1 className="text-3xl md:text-4xl font-medium text-white leading-tight">
                                        {stepData.question}
                                    </h1>
                                    <p className="text-lg text-zinc-500 font-light">
                                        {stepData.description}
                                    </p>
                                </div>
                                <div className="flex items-center group">
                                    {stepData.type === "textarea" ? (
                                        <Textarea
                                            ref={inputRef as any}
                                            value={currentValue}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, [stepData.field]: e.target.value})}
                                            onKeyDown={handleKeyDown}
                                            placeholder={stepData.placeholder}
                                            className="flex-1 bg-transparent border-0 border-b border-white/10 text-xl md:text-2xl py-4 text-white placeholder:text-zinc-700 focus:ring-0 focus:border-indigo-500 rounded-none resize-none shadow-none transition-colors"
                                            autoFocus
                                        />
                                    ) : (
                                        <Input
                                            ref={inputRef as any}
                                            type={stepData.type}
                                            value={currentValue}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, [stepData.field]: e.target.value})}
                                            onKeyDown={handleKeyDown}
                                            placeholder={stepData.placeholder}
                                            className="flex-1 bg-transparent border-0 border-b border-white/10 text-xl md:text-2xl py-4 text-white placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:border-indigo-500 rounded-none h-auto shadow-none transition-colors"
                                            autoFocus
                                        />
                                    )}
                                    <Icon className="w-5 h-5 text-zinc-600 ml-2" />
                                </div>
                                <div className="flex items-center justify-between pt-8">
                                    <div className="flex items-center gap-2 text-zinc-600">
                                        {
                                            stepData.type === "textarea" ? (
                                                <>
                                                    <Command className="w-3 h-3" />
                                                    <span>+ Enter</span>
                                                </>
                                            ) : (
                                                <span>Press Enter</span>
                                            )
                                        }
                                        <span className="ml-1">to continue</span>
                                    </div>
                                    <Button
                                        onClick={handleNext}
                                        disabled={!isStepValid || isAnimating}
                                        className={cn(
                                            "rounded-full px-8 py-6 text-base font-medium transition-all duration-300",
                                            !isStepValid
                                                ? "bg-zinc-800 text-zinc-500 hover:bg-zinc-800 cursor-not-allowed"
                                                : "bg-white text-black hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10"
                                        )}
                                    >
                                        {currentStep === STEPS.length - 1 ? "Submit" : "Continue"}
                                        {currentStep === STEPS.length - 1 ? (
                                            <Sparkles className="w-4 h-4 ml-2" />
                                        ) : (
                                            <ArrowRight className=" w-4 h-4 ml-2"/>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </>
    );
};

export default InitialForm;