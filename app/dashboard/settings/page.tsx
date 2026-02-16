"use client"

import TeamSection from '@/components/dashbaord/settings/teamSection';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';

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
        </div>
    );
};

export default SettingsPage;