"""Buat gambar pratinjau tautan (1200x630) dari satu foto.

Pemakaian:
    python alat/siapkan-pratinjau.py "foto-asli.jpg" konten/foto/pratinjau.jpg 0.06

Angka terakhir = posisi potongan dari atas (0 = paling atas, 0.3 = 30% ke bawah); sesuaikan agar wajah terlihat.
Butuh: pip install pillow
"""
import sys
from PIL import Image, ImageOps
src, dst, top = sys.argv[1], sys.argv[2], float(sys.argv[3])
im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
w, h = im.size
ch = round(w * 630 / 1200)                 # rasio 1200x630
y = max(0, min(h - ch, round(h * top)))
im.crop((0, y, w, y + ch)).resize((1200, 630), Image.LANCZOS).save(dst, quality=80, optimize=True, progressive=False)
print(dst, Image.open(dst).size)
