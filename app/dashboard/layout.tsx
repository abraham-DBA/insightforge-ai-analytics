"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/dashbaord/sidebar";
// import Header from "@/components/dashboard/Header";

type Props = {
    children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
    return (
        <div className="flex min-h-screen bg-[#050509] text-white font-sans">
            <Sidebar />

            {/* Content area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/*<Header />*/}

                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
