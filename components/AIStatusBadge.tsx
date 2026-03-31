"use client";

import { BotMessageSquare } from "lucide-react";

interface AIStatusBadgeProps {
  className?: string;
}

export function AIStatusBadge({ className }: AIStatusBadgeProps) {
  return (
    <div className={`flex items-center gap-2 text-sm ${className || ''}`}>
      <div className="flex items-center gap-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-full">
        <BotMessageSquare className="h-4 w-4" />
        <span className="font-medium">AI Tutor Online</span>
      </div>
    </div>
  );
}
