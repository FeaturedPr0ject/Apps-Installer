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


## Download behavior

The Games page uses the existing `download` field as the destination. Clicking Download opens that URL and adds the app to the separate Downloads history view on this device. The history is stored locally in the browser and can be cleared at any time. The site records that a link was opened; the browser or destination server manages the actual transfer and its progress.

The `download` field accepts either a URL string:

```json
"download": "https://example.com/game-setup.exe"
```

Or an object for a named direct-download file:

```json
"download": {
  "url": "https://example.com/game-setup.exe",
  "filename": "GameSetup.exe"
}
```

The optional filename is applied only for same-origin links, because browsers restrict forced downloads from other domains. External links continue to open at the exact provided destination.
