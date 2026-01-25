"use client";

import React, {useEffect, useState} from 'react';
import InitialForm from "@/components/dashboard/initialForm";

const Page = () => {
    const [isMetaDataAvailable, setIsMetaDataAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMetadata = async () => {
            const response = await fetch("/api/metadata/fetch");
            const data = await response.json();
            setIsMetaDataAvailable(data.exists)
            setIsLoading(false);
        };
        fetchMetadata();
    }, []);

    if (isLoading) {
        return <div className="flex-1 flex w-full items-center justify-center p-4"></div>;
    };
    return (
        <div className="flex-1 flex w-full">
            {!isMetaDataAvailable ? (
                <div className="w-full flex items-center justify-center p-4 ">
                    <InitialForm />
                </div>
            ) : (
                <>
                </>
            )}
        </div>
    );
};

export default Page;