import React from 'react';
import Navbar from "@/components/landing/nav";
import Hero from "@/components/landing/hero";
import SocialProof from "@/components/landing/social";
import Features from "@/components/landing/features";
import Integration from "@/components/landing/integration";

const Page = () => {
    return (
        <main className="w-full flex flex-col relative z-10">
            <Navbar />
            <Hero />
            <SocialProof />
            <Features />
            <Integration />
        </main>
    );
};

export default Page;