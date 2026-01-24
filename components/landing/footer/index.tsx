import React from 'react';
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="border-t border-white/5 py-12 bg-black/40">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        {/* Forge Mark */}
                        <div className="relative w-7 h-7 rounded-md bg-white flex items-center justify-center">
                            <div className="w-[3px] h-4 bg-black rounded-full" />
                        </div>

                        {/* Brand */}
                        <span className="text-base font-semibold tracking-tight text-white">
                        Insight<span className="text-white/60">Forge</span>
                    </span>
                    </Link>
                </div>
                <div className="flex gap-8 text-sm text-zinc-600 font-light">
                    <Link href="#" className="hover:text-zinc-400 transition-colors">
                        Privacy
                    </Link>
                    <Link href="#" className="hover:text-zinc-400 transition-colors">
                        Terms
                    </Link>
                    <Link href="#" className="hover:text-zinc-400 transition-colors">
                        Twitter
                    </Link>
                </div>
                <div className="text-xs text-zinc-700">
                    &copy; {new Date().getFullYear()} InsightForge. All rights reserved.
                </div>
            </div>
            
        </footer>
    );
};

export default Footer;