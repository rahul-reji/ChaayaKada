// Minimal ambient types for the YouTube IFrame Player API.
// https://developers.google.com/youtube/iframe_api_reference

export {};

declare global {
  interface Window {
    YT?: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }

  namespace YT {
    enum PlayerState {
      UNSTARTED = -1,
      ENDED = 0,
      PLAYING = 1,
      PAUSED = 2,
      BUFFERING = 3,
      CUED = 5,
    }

    interface PlayerVars {
      autoplay?: 0 | 1;
      controls?: 0 | 1;
      disablekb?: 0 | 1;
      fs?: 0 | 1;
      modestbranding?: 0 | 1;
      playsinline?: 0 | 1;
      rel?: 0 | 1;
      origin?: string;
    }

    interface OnStateChangeEvent {
      data: PlayerState;
      target: Player;
    }
    interface OnErrorEvent {
      data: number;
      target: Player;
    }
    interface PlayerEvent {
      target: Player;
    }

    interface PlayerOptions {
      videoId?: string;
      width?: string | number;
      height?: string | number;
      playerVars?: PlayerVars;
      events?: {
        onReady?: (e: PlayerEvent) => void;
        onStateChange?: (e: OnStateChangeEvent) => void;
        onError?: (e: OnErrorEvent) => void;
      };
    }

    class Player {
      constructor(el: HTMLElement | string, options: PlayerOptions);
      playVideo(): void;
      pauseVideo(): void;
      stopVideo(): void;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
      loadVideoById(videoId: string, startSeconds?: number): void;
      cueVideoById(videoId: string, startSeconds?: number): void;
      getCurrentTime(): number;
      getDuration(): number;
      getPlayerState(): PlayerState;
      getVideoData(): { video_id: string; title: string; author: string };
      destroy(): void;
    }
  }
}
