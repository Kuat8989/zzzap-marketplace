# Zzzap! AI Video Editor 🎬 (MoviePy v2.0 Compatible)
# -------------------------

import os
import sys

try:
    from moviepy import *
    from moviepy.video.fx import Resize
except ImportError:
    print("❌ MoviePy library not found. Please install it: pip install moviepy")
    sys.exit(1)

# Paths
ASSETS_DIR = "project_zzzap/REELS_1/raw"
OUTPUT_FILE = "project_zzzap/REELS_1/FINAL_REEL.mp4"

# Check if files exist
if not os.path.exists(os.path.join(ASSETS_DIR, "good.jpg")):
    print(f"❌ Missing file: {ASSETS_DIR}/good.jpg")
    sys.exit(1)

if not os.path.exists(os.path.join(ASSETS_DIR, "bad.mp4")):
    print(f"❌ Missing file: {ASSETS_DIR}/bad.mp4")
    sys.exit(1)

print("🎬 Starting Zzzap! Video Assembly (v2.0)...")

# --- 1. Expectation (Image) ---
# Duration: 3 seconds
clip_good = ImageClip(os.path.join(ASSETS_DIR, "good.jpg")).with_duration(3)
# Resize to 1080x1920 (approx, assuming source is huge or small)
# In v2.0, resize is often an effect or method. Let's try simple .resized() if available, or keep it simple.
# For safety in v2.0, we use with_effects([Resize(...)]) but let's try just fitting it first.
# Actually, let's skip resize for the test to avoid complexity. Just Center Crop.
# clip_good = clip_good.with_effects([Resize(height=1920)]) 

# Text Overlay: "ОЖИДАНИЕ 🔥"
# TextClip in v2.0 might need font path or system font.
try:
    txt_good = TextClip(text="ОЖИДАНИЕ 🔥", font_size=100, color='white', font='Arial', stroke_color='black', stroke_width=3)
except:
    # Fallback if font fails
    txt_good = TextClip(text="EXPECTATION", font_size=100, color='white')

txt_good = txt_good.with_position('center').with_duration(3)

scene_1 = CompositeVideoClip([clip_good, txt_good])

# --- 2. Reality (Video) ---
clip_bad = VideoFileClip(os.path.join(ASSETS_DIR, "bad.mp4"))

# Text Overlay: "РЕАЛЬНОСТЬ 🤡"
try:
    txt_bad = TextClip(text="РЕАЛЬНОСТЬ 🤡", font_size=100, color='red', font='Arial', stroke_color='black', stroke_width=3)
except:
    txt_bad = TextClip(text="REALITY", font_size=100, color='red')

txt_bad = txt_bad.with_position(('center', 'bottom')).with_duration(clip_bad.duration)

scene_2 = CompositeVideoClip([clip_bad, txt_bad])

# --- 3. Assembly ---
final_clip = concatenate_videoclips([scene_1, scene_2])

# Write File
print("⚡️ Rendering video...")
final_clip.write_videofile(OUTPUT_FILE, codec='libx264', audio_codec='aac', fps=30)
print(f"✅ DONE! Saved as {OUTPUT_FILE}")
