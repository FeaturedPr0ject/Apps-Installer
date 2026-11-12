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


## Publisher and download transparency

Apps Installer is an independent catalog and is not affiliated with the developers or publishers of the apps listed here. Download links open external websites. The site does not host, modify, bundle, or install those files. Visitors should check the destination hostname and verify the software publisher before downloading or running files.

## Responsibility notice

On first visit, the site displays a responsibility and download notice. Visitors must select **I Understand** to continue. The acknowledgement is stored in local browser storage for this notice version; the footer link allows the notice to be opened again. Updating `NOTICE_VERSION` in `responsibility.js` makes the notice appear again.

The notice describes the site's catalog-maintenance responsibilities and asks visitors to verify external download destinations, publishers, signatures, compatibility, and files before use. It is an informational acknowledgement, not a blanket waiver of legal responsibility.


## App categories

The header contains three category filters:
- `Apps`: shows every catalog entry.
- `Windows Package`: shows apps marked with `"category": "windows-package"`.
- `System Package`: shows utilities marked with `"category": "system-package"`.

Add a `category` property to each entry in `apps.json` when creating new listings. The category filters combine with the search field.


## Roblox direct installer

The Roblox primary Download button points directly to the Roblox-owned CDN bootstrapper at `https://setup.rbxcdn.com/RobloxPlayerInstaller.exe`. The extra download menu also offers the current Roblox - Windows Microsoft Store listing and the Roblox website installer as alternatives.

The direct bootstrapper avoids opening the Roblox website just to obtain the installer. It is not a complete offline installer: Roblox still needs network access to its own services and CDN for installation, updates, sign-in and gameplay. If a network blocks Roblox CDN or game services as well, the direct installer cannot bypass that network restriction.


## First-entry bot verification

The site includes an optional Cloudflare Turnstile Managed gate. It runs before the Responsibility Notice and language selector. The widget uses interaction-only appearance: normal visitors can pass without a visible checkbox, while visitors that Cloudflare considers higher risk may be asked to confirm they are human.

To enable it:

1. Create a Turnstile widget in the Cloudflare dashboard.
2. Add apps-installer-site.vercel.app as an allowed hostname.
3. Choose Managed mode for the widget.
4. In Vercel → Project Settings → Environment Variables, add:
   - TURNSTILE_SITE_KEY: the public site key.
   - TURNSTILE_SECRET_KEY: the private secret key. Keep this server-side; never place it in HTML or JavaScript.
   - TURNSTILE_SESSION_SECRET: optional, recommended random secret used to sign the verification session cookie. If omitted, the Turnstile secret is used.
   - TURNSTILE_ALLOWED_HOSTNAMES: optional comma-separated list of allowed hostnames. It defaults to apps-installer-site.vercel.app.
5. Redeploy the Production environment after adding or changing the variables.

The Vercel Function at /api/turnstile validates tokens with Cloudflare Siteverify, checks the expected action and hostname, then issues a signed HttpOnly session cookie for six hours. The browser does not receive the secret key. The gate is fail-open only while the Turnstile keys are not configured; after it is enabled, verification failures block access and provide a retry action.

Turnstile evaluates browser and request risk signals; it does not make a decision from IP address alone. Cloudflare may process technical browser and network signals for bot detection. See the Turnstile widget modes and server-side validation documentation:
- https://developers.cloudflare.com/turnstile/concepts/widget/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
