# `seedle.dev`

Easy to use windowing framework for Deno.

A seperate render thread for game logic and
I/O.

## Installation

```bash
deno install -Af \
    --unstable-ffi \
    --unstable-gpu \
    jsr:@divy/seedle
```

## Usage

```
seedle ./main.ts
```

```typescript
// main.ts
import { mouse, gpu, surface } from "seedle";

function main() {
  const { device, context } = gpu;

  const commandEncoder = device.createCommandEncoder();
  const textureView = context.getCurrentTexture().createView();

  const renderPass = commandEncoder.beginRenderPass({
    colorAttachments: [
      {
        view: textureView,
        clearValue: { 
          r: Math.sin(mouse.x / 800) * 0.5 + 0.5,
          g: Math.sin(mouse.y / 600) * 0.5 + 0.5,
          b: Math.sin((mouse.x + mouse.y) / 1400) * 0.5 + 0.5,
          a: 1.0,
        },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });

  renderPass.end();

  device.queue.submit([commandEncoder.finish()]);
  surface.present();
}

setInterval(main, 1000 / 60);
```

Compile to a single binary using:
```
seedle compile ./main.ts
```
