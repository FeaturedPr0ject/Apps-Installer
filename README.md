# Apps Installer

Static app catalog frontend for Vercel. The UI reads its entire catalog from `apps.json`; no sample apps are bundled.

## Add a app

Add an object to the JSON array in `apps.json`:

```json
[
  {
    "name": "App name",
    "image": "https://example.com/icon.png",
    "download": "https://example.com/app-download",
    "about": "Short app description"
  }
]
```

Fields:
- `name`: app/app name
- `image`: absolute HTTP(S) image URL
- `download`: HTTP(S) download destination; the Download button opens this exact URL
- `about`: description displayed below the name

## Deploy

Import this repository into Vercel. No build command is required; use the repository root as the output directory.





## Primary and extra download links

Each app always keeps `download` as its main Download button. Add `downloaddl` only when the app has extra mirrors, platforms, or variants. This adds a separate arrow button beside the main Download button; the extra menu lists only `downloaddl` entries.

```json
{
  "name": "Example App",
  "image": "https://example.com/icon.png",
  "about": "App description",
  "download": "https://example.com/main-installer.exe",
  "downloaddl": [
    {
      "name": "Mirror 1",
      "url": "https://mirror-one.example.com/app.exe"
    },
    {
      "name": "Portable version",
      "url": "https://example.com/app-portable.zip"
    }
  ]
}
```

When `downloaddl` is missing or empty, only the primary Download button is shown. Existing `download` URLs are not replaced or converted. The extra field accepts an array of option objects, an object with an `options` array, a single option object, or a name-to-URL object map.


## Create your own small ad

Edit `ad.json` to control the single compact ad card shown above the app list. It is disabled by default. Set `enabled` to `true`, then add your title, description, image and destination URL.

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


## Windows XP style advertisement popup

The Windows XP-style advertisement popup is currently disabled while the site undergoes a Safe Browsing review. Only enable it again after confirming that the ad content and destination are safe and non-deceptive. It can be closed using the title-bar X or the Escape key. Clicking the dark background does not close it. The title bar can be dragged to move the window. Adjust `popupDelayMs` in `ad.json` to change the display delay.

The popup uses adapted window, title-bar and button styling from [ShizukuIchi/winXP](https://github.com/ShizukuIchi/winXP). The original project is MIT licensed. Its MIT copyright and permission notice are included at `LICENSES/WinXP-MIT.txt`. This project uses CSS styling only and does not bundle the original Windows XP desktop or image assets. Windows XP names, artwork and trademarks belong to Microsoft; Apps Installer is not affiliated with or endorsed by Microsoft.
