import { EventType, Window } from "../deno_sdl2/mod.ts";

let surface, device, context;

let { promise, resolve } = Promise.withResolvers<void>();

if (
  typeof WorkerGlobalScope === "undefined" ||
  !(self instanceof WorkerGlobalScope)
) {
  console.error("This script must be run in a worker.");
} else {
  self.onmessage = async (event) => {
    switch (event.data.type) {
      case "init": {
        const adapter = await navigator.gpu.requestAdapter();
        device = await adapter!.requestDevice();

        surface = Window.deserialize(event.data.surface);
        context = surface.getContext("webgpu");
        context.configure({
          device,
          format: "bgra8unorm",
          width: 800,
          height: 600,
        });

        self.postMessage({ type: "ready" });
        resolve();

        break;
      }
      case EventType.MouseMotion: {
        mouse.x = event.data.x;
        mouse.y = event.data.y;
        break;
      }
    }
  };

  await promise;
}

const gpu = { device, context };
const mouse = { x: 0, y: 0 };

export { gpu, surface, mouse };
