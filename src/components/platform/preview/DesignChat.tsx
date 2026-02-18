"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, MessageSquare, Check, Undo2, Lock, Sparkles } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { SiteIntentDocument } from "@/lib/assembly";
import { useSubscription } from "@/lib/hooks/use-subscription";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  patches?: DesignPatch[];
  applied?: boolean;
}

export interface DesignPatch {
  type: "adjust_theme" | "rewrite_copy" | "add_component" | "remove_component";
  description: string;
  payload: Record<string, unknown>;
}

interface DesignChatProps {
  spec: SiteIntentDocument;
  sessionId: string;
  onApplyPatches: (patches: DesignPatch[]) => void;
  onClose: () => void;
}

export function DesignChat({
  spec,
  sessionId,
  onApplyPatches,
  onClose,
}: DesignChatProps): React.ReactElement {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { plan, isActive } = useSubscription();
  const sendMessage = useAction(api.ai.designChat.chat);

  // Pro users get unlimited, everyone else gets 1 free message
  const messagesUsed = messages.filter((m) => m.role === "user").length;
  const isProUser = plan === "pro" && isActive;
  const messageLimit = isProUser ? Infinity : 1;
  const canSendMessage = messagesUsed < messageLimit;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading || !canSendMessage) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage({
        sessionId,
        message: input.trim(),
        currentSpec: JSON.stringify({
          siteType: spec.siteType,
          businessName: spec.businessName,
          conversionGoal: spec.conversionGoal,
          componentIds: spec.pages[0]?.components.map((c) => c.componentId) ?? [],
        }),
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.message,
        patches: response.patches as DesignPatch[] | undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I had trouble processing that request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, canSendMessage, sendMessage, sessionId, spec]);

  const handleApply = useCallback(
    (messageId: string) => {
      const message = messages.find((m) => m.id === messageId);
      if (!message?.patches) return;

      onApplyPatches(message.patches);
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, applied: true } : m)));
    },
    [messages, onApplyPatches]
  );

  return (
    <div className="flex h-full w-80 flex-col border-l border-[var(--color-border)] bg-[var(--color-bg-card)]">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[var(--color-accent)]" />
          <h3
            className="text-sm font-semibold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            AI Design Chat
          </h3>
          {isProUser && (
            <span className="rounded-full bg-[var(--color-accent)]/10 px-1.5 py-0.5 text-[9px] font-bold text-[var(--color-accent)] uppercase">
              Pro
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-primary)]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="py-8 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-[var(--color-accent)]/40" />
            <p className="mb-1 text-sm font-medium text-[var(--color-text-secondary)]">
              Tell me what to change
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">
              &quot;Make the hero darker&quot; or &quot;Rewrite the about section&quot;
            </p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[var(--color-accent)] text-[var(--color-bg-primary)]"
                    : "bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]"
                }`}
              >
                <p>{msg.content}</p>

                {/* Patches (accept/reject) */}
                {msg.patches && msg.patches.length > 0 && (
                  <div className="mt-2 border-t border-[rgba(255,255,255,0.1)] pt-2">
                    {msg.patches.map((patch, i) => (
                      <div key={i} className="mb-1 text-[10px] text-[var(--color-text-tertiary)]">
                        {patch.description}
                      </div>
                    ))}
                    {!msg.applied ? (
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleApply(msg.id)}
                          className="inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold text-[#3ecfb4] transition-colors hover:bg-[#3ecfb4]/10"
                        >
                          <Check className="h-3 w-3" />
                          Apply
                        </button>
                        <button className="inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold text-[var(--color-text-tertiary)] transition-colors hover:bg-[rgba(255,255,255,0.04)]">
                          <Undo2 className="h-3 w-3" />
                          Skip
                        </button>
                      </div>
                    ) : (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-[#3ecfb4]">
                        <Check className="h-3 w-3" />
                        Applied
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-xl bg-[var(--color-bg-elevated)] px-3 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-[var(--color-accent)]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Upgrade prompt */}
      {!canSendMessage && !isProUser && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-accent-glow)] px-4 py-3 text-center">
          <Lock className="mx-auto mb-1 h-4 w-4 text-[var(--color-accent)]" />
          <p className="mb-2 text-[10px] text-[var(--color-text-secondary)]">
            Upgrade to Pro for unlimited AI chat
          </p>
          <button className="rounded-lg bg-[var(--color-accent)] px-4 py-1.5 text-[10px] font-semibold text-[var(--color-bg-primary)]">
            Upgrade to Pro — $29/mo
          </button>
        </div>
      )}

      {/* Input */}
      {canSendMessage && (
        <div className="shrink-0 border-t border-[var(--color-border)] p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              placeholder="Describe the change..."
              className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent)]/50 focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={() => void handleSend()}
              disabled={isLoading || !input.trim()}
              className="rounded-lg bg-[var(--color-accent)] p-2 text-[var(--color-bg-primary)] transition-transform hover:scale-105 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
          {!isProUser && (
            <p className="mt-1.5 text-[9px] text-[var(--color-text-tertiary)]">
              {messageLimit - messagesUsed} free message
              {messageLimit - messagesUsed !== 1 ? "s" : ""} remaining
            </p>
          )}
        </div>
      )}
    </div>
  );
}
