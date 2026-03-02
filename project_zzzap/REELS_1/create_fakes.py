from PIL import Image, ImageDraw, ImageFont
import numpy as np
import imageio
import os

# Ensure dir
os.makedirs("project_zzzap/REELS_1/raw", exist_ok=True)

# 1. Create dummy GOOD.JPG (Black image with text)
img = Image.new('RGB', (1080, 1920), color='black')
d = ImageDraw.Draw(img)
# Draw text (simple default font)
d.text((100, 900), "FAKE GOOD IMAGE", fill=(255, 255, 255))
img.save('project_zzzap/REELS_1/raw/good.jpg')
print("✅ Created fake good.jpg")

# 2. Create dummy BAD.MP4 (Noise video)
# Create a writer
writer = imageio.get_writer('project_zzzap/REELS_1/raw/bad.mp4', fps=30)
for i in range(60): # 2 seconds
    # Generate random noise frame
    frame = np.random.randint(0, 255, (1920, 1080, 3), dtype=np.uint8)
    writer.append_data(frame)
writer.close()
print("✅ Created fake bad.mp4")
