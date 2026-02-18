"use client"

import TeamSection from '@/components/dashbaord/settings/teamSection';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface organizationData {
    id: string;
    business_name: string;
    website_url: string;
    created_at: string;
}

const SettingsPage = () => {

    const [organizationData, setOrganizationData] = useState<organizationData>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrganizationData = async () => {
            try {
                const response = await fetch('/api/organization/fetch');
                const data = await response.json();
                setOrganizationData(data.organization);
            } catch (error) {
                console.error("Failed to fetch organization data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrganizationData();
    }, []);


    return (
        <div className='p-6 md:p-8 space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500'>
            <div>
                <h1 className='text-2xl font-semibold text-white tracking-tight'>Settings</h1>
                <p className='text-sm text-zinc-400 mt-1'>
                    Manage your account settings, security and preferences.
                </p>
            </div>

            <Card className="border-white/5 bg-[#0A0A0E]">
                <CardHeader>
                    <CardTitle className="text-base font-medium text-white">
                        Workspace settings
                    </CardTitle>
                    <CardDescription>
                        General settings for your organization(Read Only)
                    </CardDescription>
                    <CardContent className='space-y-6'>
                        <div className='grid gap-4 md:grid-cols-2'>
                            <div className='space-y-2'>
                                <Label htmlFor='workspace-name' className='text-zinc-500'>Workspace name</Label>
                                <div className='p-3 rounded-md bg-white/5 border border-white/5 text-zinc-300'>
                                    {isLoading ? (
                                        <div className="h-5 w-32 bg-white/10 animate-pulse rounded" />
                                    ) : (
                                        organizationData?.business_name || "Workspace"
                                    )}
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <Label className='text-zinc-500'>Primary Website</Label>
                                <div className='p-3 rounded-md border-white/5 border bg-white/5 text-zinc-300 text-sm'>
                                    {organizationData?.website_url}
                                </div>
                            </div>
                        </div>

                        <div className='grid gap-4 md:grid-cols-2'>
                            <div className='space-y-2 text-white'>
                                <Label className='text-zinc-500'>
                                    Default Language
                                </Label>
                                <div className='p-3 rounded-md border-white/5 border bg-white/5 text-zinc-300 text-sm'>
                                    English
                                </div>
                            </div>

                            <div className='space-y-2 text-white'>
                                <Label className='text-zinc-500'>
                                    Time Zone
                                </Label>
                                <div className='p-3 rounded-md border-white/5 border bg-white/5 text-zinc-300 text-sm'>
                                    EAT
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </CardHeader>

            </Card>
            <TeamSection />

            <Card className='border-red-500/10 bg-red-500/2'>
                <CardHeader>
                    <CardTitle className='text-base font-medium text-red-500'>
                        Danger Zone
                    </CardTitle>
                    <CardDescription className='text-red-500/60'>
                        Irreversible actions for this workspace
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex items-center justify-between'>
                        <div className='space-y-0.5'>
                            <p className='text-sm font-medium text-zinc-300'>Delete Workspace</p>
                            <p className='text-xs text-zinc-500'>Permanently delete all knowledge, conversations, and settings.</p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className='bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 shadow-none'
                                >
                                    <Trash2 className='h-4 w-4 mr-2'/>
                                    Delete Workspace
                                </Button>
                            </AlertDialogTrigger>

                            <AlertDialogContent className='bg-[#0e0e12] border-white/10'>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className='text-white'>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className='text-zinc-400'>
                                            This action cannot be undone. This will permanently delete your workspace
                                            and all of its data.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className='border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white'>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction className='bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20'>
                                            Delete Workspace
                                        </AlertDialogAction>
                                    </AlertDialogFooter>

                            </AlertDialogContent>
                        </AlertDialog>
                        
                    </div>
                </CardContent>

            </Card>
        </div>
    );
};

export default SettingsPage;