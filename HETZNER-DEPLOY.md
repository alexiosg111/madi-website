# Deployment auf Hetzner Webspace

Dieses Projekt ist eine reine statische Vite-Website (React 19 + React Router v7).
Der Hetzner-Webspace liefert nur die fertigen Dateien aus — Backend/Datenbank
laufen bei Convex (optional) bzw. gar nicht (reines Static-Serving).

## Voraussetzungen

- Hetzner Webspace (z. B. Level 1, reicht locker)
- FTP/SFTP-Zugang (steht in der Hetzner-Konsole: **Server → FTP-Zugangsdaten**)
- FTP-Client wie FileZilla

## Schritt 1: Build erzeugen (nur einmal pro Änderung nötig)

```bash
bun install
bun run build
```

Der Build erzeugt den Ordner `dist/`. Er enthält bereits die `.htaccess`
(SPA-Fallback für React Router), `index.html`, `manifest.webmanifest` und
`assets/` mit allen JS/CSS-Dateien samt Logo.

> **Hinweis zur Convex-Umgebungsvariable:** Ohne `VITE_CONVEX_URL` baut das
> Projekt als reine statische Seite — die Landingpage funktioniert komplett,
> nur die Login-Seite (`/auth`) ist dann deaktiviert. Falls später Anmeldung
> gewünscht ist: vor dem Build setzen:
> ```bash
> VITE_CONVEX_URL=https://<deployment>.convex.cloud bun run build
> ```

## Schritt 2: Hochladen (FTP/SFTP)

1. FileZilla öffnen und mit den Zugangsdaten verbinden (Host, Benutzer, Passwort; Port 21 oder SFTP 22).
2. Rechts in den **Webroot** des Webspaces wechseln — das ist bei Hetzner
   üblicherweise `httpdocs` (neuere Pakete auch `www`).
3. **Den kompletten Inhalt von `dist/`** (nicht den Ordner selbst) in das Webroot
   hochladen: `index.html`, `.htaccess`, `manifest.webmanifest`, `logo.svg` und `assets/`.
   Falls Dateien existieren, überschreiben lassen.

> **Wichtig:** Die Seite liegt im Webroot der Domain — nicht in einem
> Unterordner (z. B. `httpdocs/praxis/`). Die Assets werden absolut
> (`/assets/...`) referenziert und funktionieren nur an der Domain-/Subdomain-Wurzel.

## Schritt 3: Prüfen

- Domain aufrufen → Landingpage sollte erscheinen.
- Direktaufruf einer Route testen, z. B. `https://deine-domain.de/auth` →
  es muss die App erscheinen (nicht „404“) — das übernimmt die `.htaccess`.
- Mobil-Ansicht (Wisch-Reihen, Drawer-Menü) und die Google-Maps-Karte prüfen.

## Änderungen später einspielen

1. `bun run build` ausführen.
2. Nur die geänderten Dateien aus `dist/` erneut hochladen (am einfachsten:
   komplettes `dist/`-Verzeichnis überschreiben).
3. Optional: Browser-Cache leeren bzw. hard reload (Strg/Cmd + Shift + R).

## Troubleshooting

| Problem | Lösung |
|---|---|
| Weißer Screen / leere Seite | `.htaccess` liegt im Webroot? Cache leeren? Dateien vollständig hochgeladen? |
| „404“ bei /auth | SPA-Fallback greift nicht — `.htaccess` prüfen (mod_rewrite muss aktiv sein). |
| Login „nicht verfügbar“ | Normal, wenn ohne `VITE_CONVEX_URL` gebaut wurde (siehe oben). |
| Bilder/Assets laden nicht | Seite liegt nicht an der Domain-Wurzel, sondern in einem Unterordner. |
