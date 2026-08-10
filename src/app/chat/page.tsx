"use client";

import { useEffect, useState } from "react";
import { Clock, Fingerprint, MessageCircle, ShieldCheck, Zap } from "lucide-react";
import ChatWindow from "@/components/Chat/ChatWindow";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Navigation from "@/components/Common/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button, Card } from "@/components/ui";

interface SessionInfo {
  startTime: string | null;
  messageCount: number;
  isActive: boolean;
}

const INFO = [
  {
    icon: ShieldCheck,
    title: "Secure & private",
    description:
      "End-to-end encrypted conversations with complete privacy protection.",
  },
  {
    icon: Fingerprint,
    title: "Licensed pharmacists",
    description:
      "Get advice from certified healthcare professionals with years of experience.",
  },
  {
    icon: Zap,
    title: "Instant response",
    description:
      "Real-time messaging with quick responses to your health concerns.",
  },
];

export default function ChatPage() {
  const [anonId, setAnonId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    startTime: null,
    messageCount: 0,
    isActive: false,
  });

  const { user } = useAuth();

  useEffect(() => {
    const initializeSession = async () => {
      setIsInitializing(true);

      let id = localStorage.getItem("anonId");
      if (!id) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 8; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        id = result;
        localStorage.setItem("anonId", id);
      }

      const existingSession = localStorage.getItem("chatSession");
      if (existingSession) {
        setSessionInfo(JSON.parse(existingSession));
      } else {
        const newSession = {
          startTime: new Date().toISOString(),
          messageCount: 0,
          isActive: true,
        };
        localStorage.setItem("chatSession", JSON.stringify(newSession));
        setSessionInfo(newSession);
      }

      setAnonId(id);
      setIsInitializing(false);
    };

    initializeSession();
  }, []);

  const resetSession = () => {
    localStorage.removeItem("anonId");
    localStorage.removeItem("chatSession");
    localStorage.removeItem("chatMessages");
    window.location.reload();
  };

  const getSessionDuration = () => {
    if (!sessionInfo.startTime) return "0m";
    const duration = Date.now() - new Date(sessionInfo.startTime).getTime();
    return `${Math.floor(duration / (1000 * 60))}m`;
  };

  return (
    <ProtectedRoute allowedRoles={["CLIENT", "PHARMACY"]}>
      <div className="min-h-screen bg-bg">
        <Navigation
          title="Chat with Pharmacist"
          userRole={
            (user?.role?.toLowerCase() as "client" | "pharmacy" | "admin") ||
            "client"
          }
        />

        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          {isInitializing ? (
            <div className="space-y-5">
              <div className="h-20 animate-pulse rounded-card bg-surface-sunken" />
              <div className="h-[28rem] animate-pulse rounded-card bg-surface-sunken" />
            </div>
          ) : (
            <>
              {/* Session summary. Reset is destructive — it clears the local
                  transcript — so it reads as danger, not as a primary action. */}
              <Card>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink-muted">Session</p>
                    <p className="truncate font-mono text-sm text-ink">
                      {anonId}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-ink-muted">
                    <Clock className="h-4 w-4" aria-hidden />
                    {getSessionDuration()}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-ink-muted">
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    {sessionInfo.messageCount}
                    <span className="sr-only"> messages</span>
                  </div>

                  <Button variant="danger" size="sm" onClick={resetSession}>
                    Reset session
                  </Button>
                </div>
              </Card>

              <div className="mt-5 overflow-hidden rounded-card bg-surface shadow-card">
                <ChatWindow
                  chatId={anonId?.slice(0, 8) || "default"}
                  sender={user?.role === "PHARMACY" ? "pharmacist" : "user"}
                  senderName={user?.name}
                  onMessageCountChange={(count: number) =>
                    setSessionInfo((prev) => ({ ...prev, messageCount: count }))
                  }
                />
              </div>

              <ul className="mt-8 grid gap-5 sm:grid-cols-3">
                {INFO.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-card bg-surface p-6 shadow-card"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted text-ink">
                      <item.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h2 className="mt-4 text-lg text-ink">{item.title}</h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
