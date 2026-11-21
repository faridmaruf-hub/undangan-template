"""Perkecil foto prewedding untuk web.

Pemakaian:
    python alat/siapkan-foto.py "C:/folder/foto-asli" konten/foto

Setiap .jpg/.jpeg/.png di folder asal diperkecil (sisi terpanjang 1500 px),
diputar sesuai EXIF, lalu disimpan sebagai foto-01.jpg, foto-02.jpg, ... di folder tujuan.
Foto profil mempelai (persegi) sebaiknya dipotong manual dari salah satu foto.
Butuh: pip install pillow
"""
import os
import sys

from PIL import Image, ImageOps


def main(src, dst, maks=1500):
    os.makedirs(dst, exist_ok=True)
    files = sorted(f for f in os.listdir(src) if f.lower().endswith((".jpg", ".jpeg", ".png")))
    for i, f in enumerate(files, 1):
        im = ImageOps.exif_transpose(Image.open(os.path.join(src, f))).convert("RGB")
        im.thumbnail((maks, maks), Image.LANCZOS)
        out = os.path.join(dst, f"foto-{i:02d}.jpg")
        im.save(out, quality=82, optimize=True, progressive=True)
        print(f"{out}  <-  {f}  {im.size}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
