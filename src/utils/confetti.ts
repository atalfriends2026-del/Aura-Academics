import confetti from "canvas-confetti";

/**
 * Safe, crash-proof confetti utility that prevents "canvas.getBoundingClientRect is not a function"
 * and worker/resize issues in sandboxed or iframe browser environments.
 */

let customCanvas: HTMLCanvasElement | null = null;
let customCannon: confetti.CreateTypes | null = null;

function getSafeCannon(): confetti.CreateTypes | null {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }

  if (!customCanvas || !document.body.contains(customCanvas)) {
    try {
      customCanvas = document.createElement("canvas");
      customCanvas.style.position = "fixed";
      customCanvas.style.top = "0px";
      customCanvas.style.left = "0px";
      customCanvas.style.width = "100vw";
      customCanvas.style.height = "100vh";
      customCanvas.style.pointerEvents = "none";
      customCanvas.style.zIndex = "9999";
      customCanvas.width = window.innerWidth;
      customCanvas.height = window.innerHeight;
      document.body.appendChild(customCanvas);

      customCannon = confetti.create(customCanvas, {
        resize: false,
        useWorker: false,
      });
    } catch (e) {
      console.warn("Could not create custom confetti canvas:", e);
      return null;
    }
  }

  if (customCanvas) {
    customCanvas.width = window.innerWidth;
    customCanvas.height = window.innerHeight;
  }

  return customCannon;
}

export const triggerConfetti = (options?: confetti.Options): void => {
  try {
    const cannon = getSafeCannon();
    if (cannon) {
      cannon({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        disableForReducedMotion: true,
        ...options,
      });
    }
  } catch (err) {
    console.warn("Confetti animation gracefully suppressed:", err);
  }
};

export const triggerFestiveConfetti = (): void => {
  try {
    const cannon = getSafeCannon();
    if (!cannon) return;

    const count = 120;
    const defaults: confetti.Options = {
      origin: { y: 0.6 },
      disableForReducedMotion: true,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      if (cannon) {
        cannon({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }
    }

    fire(0.25, { spread: 26, startVelocity: 45 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 35 });
  } catch (e) {
    console.warn("Festive confetti safely caught:", e);
  }
};

export default triggerConfetti;
