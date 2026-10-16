#!/usr/bin/env python3
"""Build a silent, looping reel from the preview clips on a remix.gg profile.

Reads the public profile page, finds each game's preview MP4, and stitches them
together (in profile order) with brief crossfades. If the set of clips hasn't
changed since the last run, it does nothing.

Run by .github/workflows/remix-reel.yml. Needs Python 3.9+ and ffmpeg/ffprobe.

    python3 scripts/remix-reel.py            # rebuild only if clips changed
    python3 scripts/remix-reel.py --force    # rebuild regardless
"""
import argparse
import email.utils
import json
import re
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROFILE_URL = "https://remix.gg/@ness"
OUTPUT = ROOT / "public/projects/remix-games.mp4"
STATE = ROOT / "scripts/remix-reel.json"

FADE = 0.3          # seconds of crossfade between clips (0 = hard cuts)
MAX_CLIP = 8.0      # cap on each clip's length, in seconds
FPS = 30
LONG_SIDE = 1280    # output is 1280x720 or 720x1280, matching most clips
SHORT_SIDE = 720

UA = "Mozilla/5.0 (portfolio reel builder; +https://github.com/VanceWallace/portfolio)"
GAME_RE = re.compile(r"/games/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})")
PREVIEW_RE = re.compile(
    r"https://video\.remix-relay\.com/([0-9a-f-]{36})/preview-[A-Za-z0-9_-]+\.mp4")


def fail(msg):
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def fetch(url, method="GET"):
    req = urllib.request.Request(url, method=method, headers={"User-Agent": UA})
    return urllib.request.urlopen(req, timeout=60)


def last_modified(url):
    """Upload time of a clip, from its Last-Modified header (0 if unknown)."""
    try:
        with fetch(url, "HEAD") as r:
            lm = r.headers.get("Last-Modified")
        return email.utils.parsedate_to_datetime(lm).timestamp() if lm else 0
    except Exception:
        return 0


def find_clips(html):
    """One preview URL per game, in the order the games appear on the profile."""
    games = list(dict.fromkeys(GAME_RE.findall(html)))
    if not games:
        fail("no games found on the profile page; remix.gg's page layout may have changed")

    previews = {}
    for m in PREVIEW_RE.finditer(html):
        previews.setdefault(m.group(1), [])
        if m.group(0) not in previews[m.group(1)]:
            previews[m.group(1)].append(m.group(0))

    clips = []
    for gid in games:
        urls = previews.get(gid, [])
        if not urls:
            print(f"  {gid}: no preview clip, skipping")
            continue
        # A re-uploaded trailer leaves the old preview listed too; take the newest.
        # Ties (no dates) go to the last one listed.
        best = max(enumerate(urls), key=lambda iu: (last_modified(iu[1]), iu[0]))[1]
        print(f"  {gid}: {best.rsplit('/', 1)[-1]}" + (f" (newest of {len(urls)})" if len(urls) > 1 else ""))
        clips.append(best)

    if not clips:
        fail(f"found {len(games)} games but no preview clips; the page layout may have changed")
    return clips


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height:format=duration", "-of", "json", str(path)],
        capture_output=True, text=True)
    if out.returncode != 0:
        fail(f"{path.name} is not a readable video: {out.stderr.strip()}")
    info = json.loads(out.stdout)
    s = info["streams"][0]
    return s["width"], s["height"], float(info["format"]["duration"])


def build(files, output):
    infos = [probe(f) for f in files]
    portrait = sum(h > w for w, h, _ in infos) >= len(infos) / 2  # ties go to phone shape
    W, H = (SHORT_SIDE, LONG_SIDE) if portrait else (LONG_SIDE, SHORT_SIDE)
    durs = [min(d, MAX_CLIP) for _, _, d in infos]
    fade = min(FADE, *(d / 2 for d in durs)) if len(files) > 1 else 0

    parts = []
    for i, d in enumerate(durs):
        w, h, _ = infos[i]
        if (h > w) != portrait:
            # Wrong orientation (e.g. a landscape clip in a phone-shaped reel):
            # center-crop it to fill the frame instead of shrinking it into bars.
            fit = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H}"
        else:
            fit = (f"scale={W}:{H}:force_original_aspect_ratio=decrease,"
                   f"pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color=black")
        parts.append(
            f"[{i}:v]trim=0:{d:.3f},setpts=PTS-STARTPTS,fps={FPS},"
            f"{fit},setsar=1,format=yuv420p[v{i}]")
    last, t = "[v0]", durs[0]
    for i in range(1, len(files)):
        if fade > 0:
            parts.append(f"{last}[v{i}]xfade=transition=fade:duration={fade:.3f}:offset={t - fade:.3f}[x{i}]")
            t += durs[i] - fade
        else:
            parts.append(f"{last}[v{i}]concat=n=2:v=1:a=0[x{i}]")
            t += durs[i]
        last = f"[x{i}]"

    cmd = ["ffmpeg", "-y", "-v", "error"]
    for f in files:
        cmd += ["-i", str(f)]
    cmd += ["-filter_complex", ";".join(parts), "-map", last, "-an",
            "-c:v", "libx264", "-preset", "slow", "-crf", "28",
            "-movflags", "+faststart", str(output)]
    output.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(cmd, check=True)
    print(f"Wrote {output.relative_to(ROOT)}: {len(files)} clips, {W}x{H}, ~{t:.1f}s, "
          f"{output.stat().st_size / 1e6:.1f} MB")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true", help="rebuild even if nothing changed")
    args = ap.parse_args()

    print(f"Reading {PROFILE_URL}")
    with fetch(PROFILE_URL) as r:
        html = r.read().decode("utf-8", "replace")
    clips = find_clips(html)

    old = json.loads(STATE.read_text()).get("clips") if STATE.exists() else None
    if clips == old and OUTPUT.exists() and not args.force:
        print("No new or changed clips; reel is up to date.")
        return

    with tempfile.TemporaryDirectory() as tmp:
        files = []
        for i, url in enumerate(clips):
            dest = Path(tmp) / f"{i:02d}.mp4"
            with fetch(url) as r, open(dest, "wb") as f:
                f.write(r.read())
            files.append(dest)
        build(files, OUTPUT)

    STATE.write_text(json.dumps({"profile": PROFILE_URL, "clips": clips}, indent=2) + "\n")


if __name__ == "__main__":
    main()
