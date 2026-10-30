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





## Primary and extra download links

Each game always keeps `download` as its main Download button. Add `downloaddl` only when the game has extra mirrors, platforms, or variants. This adds a separate arrow button beside the main Download button; the extra menu lists only `downloaddl` entries.

```json
{
  "name": "Example Game",
  "image": "https://example.com/icon.png",
  "about": "Game description",
  "download": "https://example.com/main-installer.exe",
  "downloaddl": [
    {
      "name": "Mirror 1",
      "url": "https://mirror-one.example.com/game.exe"
    },
    {
      "name": "Portable version",
      "url": "https://example.com/game-portable.zip"
    }
  ]
}
```

When `downloaddl` is missing or empty, only the primary Download button is shown. Existing `download` URLs are not replaced or converted. The extra field accepts an array of option objects, an object with an `options` array, a single option object, or a name-to-URL object map.


## Create your own small ad

Edit `ad.json` to control the single compact ad card shown above the game list. It is disabled by default. Set `enabled` to `true`, then add your title, description, image and destination URL.

```json
{
  "enabled": true,
  "badge": "Ad",
  "title": "Your promotion title",
  "description": "A short description for your promotion.",
  "image": "https://example.com/promo-image.png",
  "url": "https://example.com/your-page",
  "button": "Learn more"
}
```

Set `enabled` to `false` to hide it. The ad is a single manually managed placement; it does not connect to an ad network or track visitors. Changes to `ad.json` appear after the Vercel deployment completes.
