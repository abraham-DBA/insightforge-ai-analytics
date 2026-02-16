// "use client";
//
// import { ReactNode } from "react";
// import Sidebar from "@/components/dashbaord/sidebar";

import {ReactNode} from "react";
import { cookies } from 'next/headers';
import Sidebar from "@/components/dashbaord/sidebar";

export const metadata= {
  title: "InsightForge Dashboard",
  description: "Forging trusted business insights from internal and external data through a conversational interface.",
};

export default async function DashboardLayout({
    children,
                                        }: Readonly<{ children: ReactNode
}>) {
    const cookieStore = await cookies();
    const metaDataCookie = cookieStore.get("metadata");

    return (
        <div className="bg-[#050509] font-sans h-screen antialiased selection:bg-zinc-800 flex overflow-hidden">
            {metaDataCookie?.value ? <>
            <Sidebar />
                <div className="flex-1 flex flex-col md:ml-64 relative h-screen overflow-y-auto transition-[margin] duration-200 ease-in-out will-change-[margin]">
                    <main className="flex-1">
                        {children}
                    </main>

                </div>

            </> : (children)}

        </div>
    )

}
