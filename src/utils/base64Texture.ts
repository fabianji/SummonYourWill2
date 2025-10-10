export function addBase64Texture(scene: Phaser.Scene, key: string, dataUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (scene.textures.exists(key)) {
      resolve();
      return;
    }
    const img = new Image();
    img.onload = () => {
      const texture = scene.textures.createCanvas(key, img.width, img.height);
      if (!texture) {
        reject(new Error('Failed to create canvas texture'));
        return;
      }
      const ctx = texture.getContext();
      if (!ctx) {
        reject(new Error('Unable to obtain 2D context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      texture.refresh();
      resolve();
    };
    img.onerror = () => reject(new Error(`Failed to load base64 texture for ${key}`));
    img.src = dataUrl;
  });
}
