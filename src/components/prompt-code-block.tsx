"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

type PromptCodeBlockProps = {
  content: string;
  title: string;
  copyLabel: string;
  copiedLabel: string;
  showCopyButton?: boolean;
};

export function PromptCodeBlock({
  content,
  title,
  copyLabel,
  copiedLabel,
  showCopyButton = true,
}: PromptCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/50">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <span>{title}</span>
        {showCopyButton && (
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition hover:border-primary/50 hover:text-primary"
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {copied ? copiedLabel : copyLabel}
          </button>
        )}
      </div>
      <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap break-words px-6 py-5 text-sm leading-relaxed text-foreground">
        <code>{content}</code>
      </pre>
    </div>
  );
}
