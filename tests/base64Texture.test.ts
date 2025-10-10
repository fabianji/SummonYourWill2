import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { addBase64Texture } from '../src/utils/base64Texture';

class TextureStub {
  private width: number;
  private height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
  getContext() {
    return {
      drawImage: vi.fn()
    } as unknown as CanvasRenderingContext2D;
  }
  refresh = vi.fn();
}

describe('addBase64Texture', () => {
  let scene: any;
  const dataUrl = 'data:image/svg+xml;base64,' + btoa("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"8\" height=\"8\"><rect width=\"8\" height=\"8\" fill=\"#fff\"/></svg>");

  beforeAll(() => {
    class MockImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      width = 8;
      height = 8;
      set src(_value: string) {
        this.onload?.();
      }
    }
    // @ts-expect-error override image constructor for tests
    globalThis.Image = MockImage;
  });

  beforeEach(() => {
    const textures = new Map<string, TextureStub>();
    scene = {
      textures: {
        exists: (key: string) => textures.has(key),
        createCanvas: (key: string, width: number, height: number) => {
          const tex = new TextureStub(width, height);
          textures.set(key, tex);
          return tex;
        }
      }
    };
  });

  it('creates texture on first call', async () => {
    await addBase64Texture(scene, 'hero-1', dataUrl);
    expect(scene.textures.exists('hero-1')).toBe(true);
  });

  it('skips creation if texture exists', async () => {
    await addBase64Texture(scene, 'hero-1', dataUrl);
    const createSpy = vi.spyOn(scene.textures, 'createCanvas');
    await addBase64Texture(scene, 'hero-1', dataUrl);
    expect(createSpy).not.toHaveBeenCalled();
  });
});
