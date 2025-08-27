"use client";
import Header from "@/app/components/Header";
import ProtectRoute from "@/app/components/ProtectRoute";
import Sidebar from "@/app/components/Sidebar";
import { URL } from "@/utils/imageUrl";
import { X, Phone, Mail, Calendar } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

export default function LeadDetails() {
  return (
    <ProtectRoute>
      <div className="min-h-screen bg-main text-white font-exo py-2">
        <Sidebar />
        <div className="md:pl-64">
          <Header />
          <main className="pt-[60px] lg:pt-[40px] min-h-screen px-4 md:px-8">
            <div className="flex items-center justify-between mb-20">
              <div className="flex items-center gap-2 text-sm">
                <Link href="/leads">
                  <span className="text-white/60">Leads</span>
                </Link>
                <span className="text-white/60">›</span>
                <span className="text-white">Lead Details</span>
              </div>
              <button className="text-white/60 hover:text-white">
                <Link href="/leads">
                  <X size={20} />
                </Link>
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile & Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Section */}
                <div className="relative grid grid-cols-1 gap-4 bg-secondary rounded-lg p-8">
                  <div className="absolute md:top-[-20%] top-[-10%] left-5 w-20 h-20 md:w-26 md:h-26 rounded-full overflow-hidden bg-slate-700">
                    <Image
                      src={URL + "dummyImg.png"}
                      alt="James Cannon"
                      width={104}
                      height={104}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-10 absolute md:top-10 top-5 md:right-15 right-5">
                    <button className="bg-blue-600 hover:bg-blue-700 text-xs px-5 py-2 rounded-md">
                      New
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-xs px-5 py-2 rounded-md">
                      Meta
                    </button>
                  </div>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-3 pt-15 gap-4 md:gap-6">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Name</div>
                      <div className="text-sm">Shiva Shankar Reddy</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">
                        Phone Number
                      </div>
                      <div className="text-sm">+1234-567-890</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Email</div>
                      <div className="text-sm">shiva@gmail.com</div>
                    </div>
                    {/* Address & Tags */}

                    <div>
                      <div className="text-xs text-slate-400 mb-1">Address</div>
                      <div className="text-sm">
                        1234phaseking,
                        <br />
                        springfield, 10677
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">
                        Location
                      </div>
                      <div className="text-sm">springfield, 10677</div>
                    </div>
                  </div>
                </div>

                {/* Leads Details */}
                <div className="bg-secondary rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">Leads Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Make</div>
                      <div className="text-sm">BMW</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Model</div>
                      <div className="text-sm">128i</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Year</div>
                      <div className="text-sm">2013</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Parts</div>
                      <div className="text-sm">Engine</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-400 mb-1">
                        Assigned
                      </div>
                      <div className="text-sm">Shan</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-1">
                        Product Interest
                      </div>
                      <div className="text-sm">Engine</div>
                    </div>
                    {/* Notes */}
                    <div className="col-span-2">
                      <div className="text-xs text-slate-400 mb-2">Notes</div>
                      <div className="bg-slate-800 p-3 rounded text-sm">
                        Interested in High Performing Engines
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Follow-ups */}
                <div className="bg-secondary rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">
                    Upcoming Follow-ups
                  </h3>
                  <div className="bg-slate-800 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-4 gap-4 p-3 text-xs text-slate-400 border-b border-slate-700">
                      <div>Date</div>
                      <div>Method</div>
                      <div>Note</div>
                      <div>Status</div>
                    </div>
                    <div className="divide-y divide-slate-700">
                      <div className="grid grid-cols-4 gap-4 p-3 text-sm">
                        <div>25Aug25</div>
                        <div>Call</div>
                        <div>Confirm Product</div>
                        <div className="text-orange-400">Pending</div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 p-3 text-sm">
                        <div>27Aug25</div>
                        <div>Email</div>
                        <div>Send Update Quotation</div>
                        <div className="text-orange-400">Pending</div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 p-3 text-sm">
                        <div>30Aug25</div>
                        <div>Meeting</div>
                        <div>Finalize Order</div>
                        <div className="text-green-400">Scheduled</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Follow-ups */}
              <div className="h-fit pt-5 pb-10 px-5 bg-secondary rounded-lg">
                <h3 className="text-lg font-medium mb-4">Follow-ups</h3>
                <div className="space-y-3">
                  <button className="w-full p-2 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Call
                  </button>
                  <button className="w-full p-2 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </button>
                  <button className="w-full p-2 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectRoute>
  );
}
