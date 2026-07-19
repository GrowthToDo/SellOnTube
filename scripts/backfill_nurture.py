"""One-shot backfill: enroll existing Loops contacts into the nurture workflow.

Fires the `nurture_start` event (cohort=backfill) for each contact in a CSV
exported from the Loops UI (Audience -> Download CSV) after the list has been
run through an email verifier (NeverBounce/ZeroBounce). The Loops workflow
trigger must be set to fire "One time" per contact, which makes re-runs and
overlap with live signups safe.

Usage:
  py scripts/backfill_nurture.py contacts.csv                 # dry run (default)
  py scripts/backfill_nurture.py contacts.csv --live --limit 100

Flags:
  --live         Actually send events. Without it, prints what would happen.
  --limit N      Max contacts to enroll this run (default 100). Run daily to
                 batch the backfill and stay inside Loops free-plan send quota
                 (4,000 sends/30d; each enrolled contact -> ~6 sends).
  --state FILE   Log of already-enrolled emails (default scripts/backfill_nurture_state.csv).
                 Re-runs skip emails already in it.

The script checks each contact via GET /contacts/find and skips anyone who is
unsubscribed or already marked bookedCall. Fails loudly: any API error stops
the run with a non-zero exit code and a summary of what was and wasn't sent.
"""

import argparse
import csv
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import json
import os

LOOPS_BASE = "https://app.loops.so/api/v1"
RATE_DELAY_S = 0.25  # 4 req/s, well under the 10 req/s team limit

# Same slug -> readable-name map as netlify/functions/capture-email.ts ({toolLabel} in email 1b)
TOOL_LABELS = {
    "youtube-autocomplete-keywords": "YouTube Autocomplete Keywords tool",
    "youtube-channel-audit": "YouTube Channel Audit tool",
    "youtube-competitor-analysis": "YouTube Competitor Analysis tool",
    "youtube-description-generator": "YouTube Description Generator",
    "youtube-ranking-checker": "YouTube Ranking Checker",
    "youtube-script-generator": "YouTube Script Generator",
    "youtube-seo-tool": "YouTube SEO tool",
    "youtube-tag-generator": "YouTube Tag Generator",
    "youtube-title-generator": "YouTube Title Generator",
    "youtube-transcript-generator": "YouTube Transcript Generator",
    "youtube-video-ideas-evaluator": "YouTube Video Idea Evaluator",
    "youtube-video-ideas-generator": "YouTube Video Ideas Generator",
    "youtube-video-keyword-finder": "YouTube Video Keyword Finder",
    "youtube-video-keyword-finder-csv": "YouTube Video Keyword Finder",
    "roi-calculator": "YouTube ROI Calculator",
    "fab": "YouTube keyword analysis offer",
    "popup": "YouTube ROI Calculator",
    "sticky-bar": "YouTube keyword analysis offer",
}


def load_api_key() -> str:
    key = os.environ.get("LOOPS_API_KEY", "").strip()
    if key:
        return key
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    try:
        with open(env_path, encoding="utf-8") as f:
            for line in f:
                if line.strip().startswith("LOOPS_API_KEY="):
                    return line.split("=", 1)[1].strip()
    except OSError:
        pass
    sys.exit("FATAL: LOOPS_API_KEY not found in environment or .env")


def api_request(method: str, path: str, key: str, body: dict | None = None) -> tuple[int, dict | list]:
    url = f"{LOOPS_BASE}{path}"
    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {key}")
    # Cloudflare blocks the default Python-urllib user agent with 403
    req.add_header("User-Agent", "sellontube-backfill/1.0")
    if data is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            return res.status, json.loads(res.read().decode("utf-8") or "{}")
    except urllib.error.HTTPError as e:
        try:
            payload = json.loads(e.read().decode("utf-8") or "{}")
        except (ValueError, OSError):
            payload = {}
        return e.code, payload


def read_contacts(csv_path: str) -> list[dict]:
    # utf-8-sig: Loops/Excel exports may carry a BOM
    with open(csv_path, encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames is None:
            sys.exit(f"FATAL: {csv_path} has no header row")
        email_col = next((c for c in reader.fieldnames if c.strip().lower() == "email"), None)
        if email_col is None:
            sys.exit(f"FATAL: no 'email' column in {csv_path} (columns: {reader.fieldnames})")
        tool_col = next((c for c in reader.fieldnames if c.strip().lower() == "toolname"), None)
        contacts = []
        for row in reader:
            email = (row.get(email_col) or "").strip().lower()
            if not email or "@" not in email:
                continue
            contacts.append({"email": email, "toolName": (row.get(tool_col) or "").strip() if tool_col else ""})
        return contacts


def read_state(state_path: str) -> set[str]:
    if not os.path.exists(state_path):
        return set()
    with open(state_path, encoding="utf-8-sig", newline="") as f:
        return {row["email"].strip().lower() for row in csv.DictReader(f) if row.get("email")}


def append_state(state_path: str, email: str) -> None:
    new_file = not os.path.exists(state_path)
    with open(state_path, "a", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        if new_file:
            writer.writerow(["email", "enrolled_at"])
        writer.writerow([email, time.strftime("%Y-%m-%dT%H:%M:%S")])


def main() -> None:
    parser = argparse.ArgumentParser(description="Backfill Loops contacts into the nurture workflow")
    parser.add_argument("csv_path", help="Verified contacts CSV (must contain an 'email' column)")
    parser.add_argument("--live", action="store_true", help="Actually send events (default: dry run)")
    parser.add_argument("--limit", type=int, default=100, help="Max contacts to enroll this run")
    parser.add_argument(
        "--state",
        default=os.path.join(os.path.dirname(__file__), "backfill_nurture_state.csv"),
        help="CSV log of already-enrolled emails",
    )
    args = parser.parse_args()

    key = load_api_key()
    contacts = read_contacts(args.csv_path)
    done = read_state(args.state)
    pending = [c for c in contacts if c["email"] not in done]
    batch = pending[: args.limit]

    print(f"CSV contacts: {len(contacts)} | already enrolled: {len(done)} | pending: {len(pending)}")
    print(f"This run: {len(batch)} contact(s) | mode: {'LIVE' if args.live else 'DRY RUN'}")
    print(f"Send budget note: {len(batch)} contacts x ~6 emails = ~{len(batch) * 6} sends over the sequence.")

    enrolled, skipped, failures = 0, 0, []
    for i, contact in enumerate(batch, 1):
        email = contact["email"]
        time.sleep(RATE_DELAY_S)
        status, found = api_request("GET", f"/contacts/find?email={urllib.parse.quote(email)}", key)
        if status != 200:
            failures.append((email, f"find failed: HTTP {status} {found}"))
            print(f"[{i}/{len(batch)}] {email} -> FIND FAILED (HTTP {status}), stopping run")
            break
        record = found[0] if isinstance(found, list) and found else None
        if record is None:
            skipped += 1
            print(f"[{i}/{len(batch)}] {email} -> skip (not in Loops audience)")
            continue
        if record.get("subscribed") is False:
            skipped += 1
            print(f"[{i}/{len(batch)}] {email} -> skip (unsubscribed)")
            continue
        if record.get("bookedCall") is True:
            skipped += 1
            print(f"[{i}/{len(batch)}] {email} -> skip (already booked a call)")
            continue

        if not args.live:
            print(f"[{i}/{len(batch)}] {email} -> would enroll (dry run)")
            continue

        body = {
            "email": email,
            "eventName": "nurture_start",
            "cohort": "backfill",
        }
        if contact["toolName"]:
            tool_label = TOOL_LABELS.get(contact["toolName"], "YouTube tool")
            body["toolLabel"] = tool_label
            body["eventProperties"] = {"toolName": contact["toolName"], "toolLabel": tool_label}
        time.sleep(RATE_DELAY_S)
        status, resp = api_request("POST", "/events/send", key, body)
        if status == 200:
            enrolled += 1
            append_state(args.state, email)
            print(f"[{i}/{len(batch)}] {email} -> enrolled")
        else:
            failures.append((email, f"events/send failed: HTTP {status} {resp}"))
            print(f"[{i}/{len(batch)}] {email} -> SEND FAILED (HTTP {status}), stopping run")
            break

    print(f"\nSummary: enrolled={enrolled} skipped={skipped} failed={len(failures)} "
          f"remaining={len(pending) - enrolled - skipped - len(failures)}")
    if failures:
        for email, reason in failures:
            print(f"  FAIL {email}: {reason}")
        sys.exit(1)


if __name__ == "__main__":
    main()
