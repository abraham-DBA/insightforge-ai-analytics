import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Sidebar from "@/components/dashboard/sidebar";

export const metadata: Metadata = {
    title: "InsightForge - Dashboard",
    description: "InsightForge Dashboard"
}

export default async function DashboardLayout({
                                                  children,
                                              }: Readonly<{
    children: React.ReactNode
}>) {
    const cookieStore = await cookies();
    const metaDataCookie = cookieStore.get("metadata");

    return (
        <div className="bg-[#050509] min-h-screen font-sans antialiased text-zinc-100 selection:bg-zinc-800 flex">
            {metaDataCookie?.value ? <>
                <Sidebar />
                <div className="flex-1 flex flex-col md:ml-64 relative min-h-screen transition-all duration-300 ease-in-out">
                    {/*<Header />*/}
                    <main className="flex-1"> {children} </main>
                </div>
                </> : (
                children
            )}
        </div>
    )
}