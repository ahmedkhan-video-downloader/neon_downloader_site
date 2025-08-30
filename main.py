
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp
import os

app = FastAPI()

# تمكين CORS للواجهة
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DownloadRequest(BaseModel):
    url: str
    type: str  # video or audio

@app.post("/download")
async def download_media(req: DownloadRequest):
    try:
        # إعدادات yt-dlp
        ydl_opts = {
            "quiet": True,
            "no_warnings": True,
            "skip_download": True,
            "format": "bestaudio/best" if req.type=="audio" else "best",
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(req.url, download=False)
            # نرجع أفضل رابط مباشر
            if req.type == "audio":
                formats = [f for f in info["formats"] if f.get("acodec") != "none"]
            else:
                formats = [f for f in info["formats"] if f.get("vcodec") != "none"]
            if not formats:
                return {"success": False, "error": "لا يوجد روابط مباشرة"}
            best = formats[-1]
            return {"success": True, "download_url": best["url"]}
    except Exception as e:
        return {"success": False, "error": str(e)}
