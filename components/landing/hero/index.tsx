import React from 'react';
import {ArrowRight, Send, User} from "lucide-react";
import Image from "next/image";

/**
 *
 */
const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden ">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-white/10 bg-white/5 backdrop-blur-md mb-8 animate-float">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34, 197, 94, 0.4)]"></span>
                    <span className="text-xs text-zinc-300 tracking-wide font-light">
                        Version 1.0.0 available now
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-6 leading-[1.1]">
                    Human-Centered Support,
                    <br />
                        <span className="text-zinc-500">
                            powered by AI
                        </span>

                </h1>
                <p className="text-lg md:text-xl text-zinc-400 font-light mb-10 max-w-2xl mx-auto leading-relaxed">
                    Resolve questions instantly with an assistant grounded in your data — clear answers, real understanding, no robotic replies.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <button className="h-11 px-8 cursor-pointer rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-all flex items-center gap-2">
                        Start for free
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <button className="h-11 px-8 rounded-full border border-zinc-800 text-zinc-300 text-sm font-medium hover:border-zinc-600 hover:text-white transition-all bg-black/20 backdrop-blur-sm">
                        View Demo
                    </button>
                </div>
            </div>

            {/*floating chat vistualization*/}
            <div className="max-w-3xl mx-auto relative z-10">
              <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="rounded-2xl p-1 md:p-2 relative overflow-visible ring-1 ring-white/10 bg-[#0a0a0e] shadow-2xl">
                <div className="flex flex-col w-full bg-[#0a0a0e] rounded-xl overflow-visible">
                  <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0E0E12] shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <div className="text-sm font-medium text-zinc-300">InsightForge Inc</div>
                    </div>
                  </div>

                  <div className="flex-1 p-6 space-y-6 bg-zinc-950/30 overflow-visible flex flex-col">
                    {/* AI response */}
                    <div className="flex w-full flex-col items-start">
                      <div className="flex max-w-[85%] gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-white">
                          <Image src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="Support Agent" width={40} height={40} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="space-y-2">
                          <div className="p-4 rounded-2xl text-sm leading-relaxed shadow-sm bg-white text-zinc-900 rounded-tl-sm">
                            Hey there, what would you like to understand from your data today?
                          </div>
                          <div className="flex flex-wrap gap-2 pr-1 ml-1">
                            <span className="px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-xs font-medium cursor-default">Data Overview</span>
                            <span className="px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-xs font-medium cursor-default">Recent Metrics</span>
                            <span className="px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 text-xs font-medium cursor-default">Documentation</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* user response */}
                    <div className="flex w-full flex-col items-end mt-5">
                      <div className="flex max-w-[85%] gap-3 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 bg-zinc-800">
                          <User className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div className="p-4 rounded-2xl text-sm leading-relaxed shadow-sm bg-zinc-800 text-zinc-200 rounded-tr-sm">
                          Can you show me sales performance for the last quarter?
                        </div>
                      </div>
                    </div>

                    {/* AI response */}
                    <div className="flex w-full flex-col items-start mt-5">
                      <div className="flex max-w-[85%] gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/5 overflow-hidden">
                          <Image src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="Support Agent" width={40} height={40} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="p-4 rounded-2xl text-sm leading-relaxed shadow-sm bg-white text-zinc-900 rounded-tl-sm">
                          <div className="space-y-4 text-sm leading-relaxed text-zinc-900">
                            <p className="font-medium">Here’s a summary of sales performance for the last quarter (Q4):</p>
                            <ul className="list-disc pl-5 space-y-1">
                              <li><span className="font-medium">Total Revenue:</span> $1.28M (+12% QoQ)</li>
                              <li><span className="font-medium">Total Orders:</span> 9,842</li>
                              <li><span className="font-medium">Average Order Value:</span> $130</li>
                              <li><span className="font-medium">Top Region:</span> East Africa (38% of total revenue)</li>
                            </ul>
                            <p>Revenue increased steadily throughout the quarter, driven primarily by higher order volume rather than price changes. The strongest growth occurred in November, following promotional campaigns.</p>
                            <p className="text-xs text-zinc-500">Data source: Gold layer — aggregated from CRM and ERP sales tables.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* input area */}
                  <div className="p-4 bg-[#0A0A0E] border-t border-white/5 shrink-0">
                    <div className="relative">
                      <div className="min-h-[50px] w-full px-4 py-3 text-sm bg-zinc-900/50 border border-white/10 rounded-xl text-zinc-500 flex items-center justify-between">
                        <span>Type a message...</span>
                        <button className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500 cursor-default">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </section>
    );
};

export default Hero;