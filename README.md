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




## Optional per-game dropdown field

The special dropdown is enabled only when a game object contains `downloaddl`. The existing `download` field is not replaced and remains the normal single Download link for games that do not use the special dropdown.

Example with the special dropdown:

```json
{
  "name": "Example Game",
  "image": "https://example.com/icon.png",
  "about": "Game description",
  "download": "https://example.com/default-download",
  "downloaddl": [
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

When `downloaddl` is absent, the page uses `download` as a regular link, preserving all existing game entries unchanged. Supported `downloaddl` formats are an array of option objects, an object with an `options` array, a single option object, or a name-to-URL object map. Each option can use `name` (or `label`, `platform`, `version`) and `url` (or `link`, `href`).
