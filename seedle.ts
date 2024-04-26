import { EventType, Window, WindowBuilder } from "../deno_sdl2/mod.ts";

function start(
  window: Window,
  workerFile: string = "./main.ts",
) {
  const surface = window.serialize();
  const worker = new Worker(workerFile, { type: "module" });
  worker.postMessage({ type: "init", surface }, [surface]);

  worker.onmessage = (event) => {
    for (const events of window.events(true)) {
      if (events.type === EventType.Quit) {
        worker.terminate();
        break;
      }
      if (events.type === EventType.Draw) {
        continue;
      }

      worker.postMessage(events);
    }
  };
}

const win = new WindowBuilder("seedle", 800, 600).build();
start(win, `file:///${Deno.cwd()}/main.ts`);
