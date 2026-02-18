"use client";

import React, {useEffect, useState} from 'react';
import InitialForm from "@/components/dashbaord/initialForm";
import DashboardOverview from "@/components/dashbaord/dashboardOverview";

const Page = () => {
    const [isMetaDataAvailable, setIsMetaDataAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const response = await fetch("/api/metadata/fetch");
                if (!response.ok) throw new Error("Failed to fetch metadata");
                const data = await response.json();
                setIsMetaDataAvailable(data.exists)
                } catch (err) {
                setIsMetaDataAvailable(false);
                } finally {
                setIsLoading(false);
                }
        };
        fetchMetadata();
    }, []);

    if (isLoading) {
        return (
            <div className="flex-1 flex w-full items-center justify-center p-4" />
        )
    };
    return (
        <div className="flex-1 flex w-full">
            {!isMetaDataAvailable ? (
                <div className="w-full flex items-center justify-center p-4 min-h-screen">
                    <InitialForm />
                </div>
            ) : (
                <DashboardOverview />
            )}
        </div>
    );
};

export default Page;