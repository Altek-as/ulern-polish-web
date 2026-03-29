"use client";

import { useState, useEffect } from "react";

export function AIStatusBadge() {
  const [status, setStatus] = useState<"online" | "offline">("offline");

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          setStatus("online");
        } else {
          setStatus("offline");
        }
      } catch {
        setStatus("offline");
      }
    }
    checkHealth();
    // Re-check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium">
      <span
        className={`inline-block w-2 h-2 rounded-full ${
          status === "online" ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span className="text-gray-600 dark:text-gray-400">
        AI: {status === "online" ? "Online" : "Offline"}
      </span>
    </div>
  );
}
