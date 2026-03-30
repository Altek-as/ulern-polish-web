"use client";

import { useState, useEffect } from "react";

interface HealthStatus {
  openrouter: boolean;
  elevenlabs: boolean;
  whisper: boolean;
  supabase: boolean;
}

export function AIStatusBadge() {
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          const data = await res.json();
          setHealth({
            openrouter: !!data.openrouter,
            elevenlabs: !!data.elevenlabs,
            whisper: !!data.whisper,
            supabase: !!data.supabase
          });
        } else {
          setHealth(null);
        }
      } catch {
        setHealth(null);
      }
    }
    checkHealth();
    // Re-check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!health) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium">
        <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
        <span className="text-gray-600 dark:text-gray-400">AI: Offline</span>
      </div>
    );
  }

  const allOnline = health.openrouter && health.elevenlabs && health.whisper && health.supabase;
  const anyOnline = health.openrouter || health.elevenlabs || health.whisper;

  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      <div className="flex items-center gap-1" title="OpenRouter (LLM)">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            health.openrouter ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-gray-600 dark:text-gray-400">LLM</span>
      </div>
      <div className="flex items-center gap-1" title="ElevenLabs (TTS)">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            health.elevenlabs ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-gray-600 dark:text-gray-400">TTS</span>
      </div>
      <div className="flex items-center gap-1" title="Whisper (STT)">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            health.whisper ? "bg-green-500" : "bg-yellow-400"
          }`}
        />
        <span className="text-gray-600 dark:text-gray-400">STT</span>
      </div>
      <div className="flex items-center gap-1" title="Supabase (Auth + DB)">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            health.supabase ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-gray-600 dark:text-gray-400">DB</span>
      </div>
      {allOnline && (
        <span className="text-green-600 dark:text-green-400 ml-1">✓</span>
      )}
      {!allOnline && anyOnline && (
        <span className="text-yellow-500 ml-1">⚠</span>
      )}
      {!anyOnline && (
        <span className="text-red-500 ml-1">✗</span>
      )}
    </div>
  );
}
