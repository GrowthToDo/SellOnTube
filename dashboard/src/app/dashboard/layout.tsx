"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import FeedbackModal from "@/components/FeedbackModal";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar onFeedbackClick={() => setFeedbackOpen(true)} />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
