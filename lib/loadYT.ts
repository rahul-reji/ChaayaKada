// Loads the YouTube IFrame Player API exactly once and resolves when YT is
// ready. Safe to call from multiple components — the promise is memoised.

let promise: Promise<typeof YT> | null = null;

export function loadYT(): Promise<typeof YT> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("loadYT called on the server"));
  }
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }
  if (promise) return promise;

  promise = new Promise<typeof YT>((resolve) => {
    // Chain any pre-existing callback so we don't clobber another consumer.
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT!);
    };

    const existing = document.getElementById("youtube-iframe-api");
    if (!existing) {
      const tag = document.createElement("script");
      tag.id = "youtube-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }
  });

  return promise;
}
