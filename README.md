# Games Installer

Static game catalog frontend for Vercel. The UI reads its entire catalog from `games.json`; no sample apps are bundled.

## Add a game

Add an object to the JSON array in `games.json`:

```json
[
  {
    "name": "Game name",
    "image": "https://example.com/icon.png",
    "download": "https://example.com/game-download",
    "about": "Short game description"
  }
]
```

Fields:
- `name`: app/game name
- `image`: absolute HTTP(S) image URL
- `download`: HTTP(S) download destination; the Download button opens this exact URL
- `about`: description displayed below the name

## Deploy

Import this repository into Vercel. No build command is required; use the repository root as the output directory.



## Per-game download dropdown

Each game card has its own **Download** dropdown. Every option is built from that game's `download` field. Use an array when one game has multiple platforms or installer variants:

```json
{
  "name": "Example Game",
  "image": "https://example.com/icon.png",
  "about": "Game description",
  "download": [
    {
      "name": "Windows 64-bit",
      "url": "https://example.com/game-win64.exe"
    },
    {
      "name": "Android APK",
      "url": "https://example.com/game.apk"
    }
  ]
}
```

Supported formats:
- A string URL: displays one dropdown choice named `Download`.
- An array of objects: each `name` and `url` becomes one choice.
- An object map: keys become choice names and values are URLs, for example `"download": {"Windows": "https://...", "Android": "https://..."}`.
- A single object with `name` and `url` is also accepted. Optional `filename` is applied only for same-origin downloads.

The dropdown belongs to its own game card; selecting an option opens that exact URL in a new tab. Actual download behavior depends on the destination server and browser.
