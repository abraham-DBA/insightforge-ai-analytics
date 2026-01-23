import React from 'react';
import Navbar from "@/components/landing/nav";
import Hero from "@/components/landing/hero";

const Page = () => {
    return (
        <main className="w-full flex flex-col relative z-10">
            <Navbar />
            <Hero />
        </main>
    );
};

export default Page;