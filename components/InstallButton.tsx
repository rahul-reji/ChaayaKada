"use client";

import { useEffect, useState } from "react";

type InstallState = "hidden" | "android" | "ios";

function IosModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-white/10 p-6 shadow-2xl"
        style={{ background: "rgba(20,14,8,0.92)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-white/40 transition hover:text-white/80"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-3 text-3xl">📱</div>
        <h2 className="mb-1 text-lg font-semibold text-white">Install Chayakada</h2>
        <p className="mb-4 text-sm text-white/50">Add to your home screen for a full-screen app experience.</p>

        <ol className="space-y-3 text-sm text-white/70">
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">1</span>
            <span>Tap the <strong className="text-white">Share</strong> button <span className="inline-block rounded bg-white/10 px-1">⬆</span> in Safari's toolbar</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">2</span>
            <span>Scroll down and tap <strong className="text-white">Add to Home Screen</strong></span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">3</span>
            <span>Tap <strong className="text-white">Add</strong> in the top-right corner</span>
          </li>
        </ol>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl py-2.5 text-sm font-medium"
          style={{
            background: "rgba(224,180,106,0.15)",
            border: "1px solid rgba(224,180,106,0.4)",
            color: "rgb(224,180,106)",
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export function InstallButton() {
  const [state, setState] = useState<InstallState>("hidden");
  const [prompt, setPrompt] = useState<any>(null);
  const [showIosModal, setShowIosModal] = useState(false);

  useEffect(() => {
    // already running as installed PWA — hide the button
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const isIos =
      /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;

    if (isIos) {
      setState("ios");
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
      setState("android");
    };
    const onInstalled = () => setState("hidden");

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setState("hidden");
    setPrompt(null);
  }

  if (state === "hidden") return null;

  const btnCls =
    "flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 p-2.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/70 sm:px-3.5 sm:py-1.5";

  const icon = (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );

  if (state === "ios") {
    return (
      <>
        <button onClick={() => setShowIosModal(true)} aria-label="Install app" className={btnCls}>
          {icon}
          <span className="hidden sm:inline">Install App</span>
        </button>
        {showIosModal && <IosModal onClose={() => setShowIosModal(false)} />}
      </>
    );
  }

  return (
    <button onClick={install} aria-label="Install app" className={btnCls}>
      {icon}
      <span className="hidden sm:inline">Install App</span>
    </button>
  );
}
