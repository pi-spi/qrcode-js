# @pi-spi/qrcode

SDK JavaScript officiel pour générer les payloads EMV des QR Codes PI-SPI pour les entreprises / business.

Ce package fonctionne dans tous les environnements JavaScript modernes :

- Application HTML classique (script bundlé ou `<script type="module">`)
- Frameworks front (Angular, React, Vue, …)
- Exécution côté serveur (Node.js, serverless)

## Installation

```bash
npm install @pi-spi/qrcode
```

## Usage rapide

```ts
import { buildPayloadString } from '@pi-spi/qrcode';

const payload = buildPayloadString({
  alias: '3497a720-ab11-4973-9619-534e04f263a1',
  countryCode: 'CI',
  qrType: 'STATIC',
  referenceLabel: 'CAISSE_A01',
  amount: 1500,
});

console.log(payload);
```

### API

```ts
createQrPayload(input: QrPayloadInput, options?: QrPayloadOptions): QrPayloadResult
buildPayloadString(input: QrPayloadInput, options?: QrPayloadOptions): string
computeCrc16(payload: string): string
isValidPispiQrPayload(payload: string): QrValidationResult
generateQrCodeSvg(input: QrPayloadInput, options?: QrCodeSvgOptions): Promise<string>
DEFAULT_PISPI_LOGO_DATA_URL: string
```

### Types & options

#### `QrPayloadInput`

| Champ            | Type               | Description                                            |
| ---------------- | ------------------ | ------------------------------------------------------ |
| `alias`          | `string`           | Alias de compte PI-SPI (obligatoire).                  |
| `countryCode`    | `string`           | Code pays ISO 3166-1 alpha-2 (obligatoire).            |
| `qrType`         | `QrType`           | `STATIC` ou `DYNAMIC` (obligatoire).                   |
| `referenceLabel` | `string`           | Libellé de référence présenté au payeur (obligatoire). |
| `amount`         | `number \| string` | Montant optionnel (sera normalisé au format EMV).      |

#### `QrPayloadOptions`

| Champ            | Type                      | Description                                                        |
| ---------------- | ------------------------- | ------------------------------------------------------------------ |
| `additionalData` | `AdditionalDataOverrides` | Permet de surcharger certaines valeurs (channel, purpose, custom). |

#### `QrCodeSvgOptions`

| Champ                   | Type     | Description                                                                                   |
| ----------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `size`                  | `number` | Largeur/hauteur du SVG généré (pixels). Par défaut `400`.                                     |
| `margin`                | `number` | Marge autour du QR en pixels. Par défaut `0` (le SVG utilise toute la surface).               |
| `logoDataUrl`           | `string` | Data URL (`data:image/...`) du logo à intégrer. Défaut : logo PI-SPI.                         |
| `logoSizeRatio`         | `number` | Ratio du logo par rapport à la taille totale (entre `0.08` et `0.25`). Défaut : `0.18`.       |
| `logoPaddingRatio`      | `number` | Padding autour du logo (sur le pavé central) relatif à la taille du logo. Défaut : `0`.       |
| `logoBackgroundColor`   | `string` | Couleur de fond du pavé qui reçoit le logo. Défaut : `#FFFFFF`.                               |
| `logoBorderRadiusRatio` | `number` | Arrondi des coins du pavé, relatif à sa taille (`0` = carré, `0.5` = cercle). Défaut : `0.5`. |
| `dotColor`              | `string` | Couleur des “dots” du QR (hex, rgb, etc.). Défaut : `#1A1A1A`.                                |
| `backgroundColor`       | `string` | Couleur de fond du QR (hors logo). Défaut : `#FFFFFF`.                                        |

#### `QrValidationResult`

| Champ    | Type              | Description                                               |
| -------- | ----------------- | --------------------------------------------------------- |
| `valid`  | `boolean`         | `true` si la payload respecte la structure PI-SPI.        |
| `errors` | `string[]`        | Liste des erreurs détectées (vide si `valid === true`).   |
| `data`   | `QrPayloadInput?` | Les champs extraits de la payload lorsqu’elle est valide. |

### Générer un QR Code SVG avec logo

```ts
import {
  generateQrCodeSvg,
  DEFAULT_PISPI_LOGO_DATA_URL,
} from '@pi-spi/qrcode';

const svg = await generateQrCodeSvg(
  {
    alias: '2250000000001',
    countryCode: 'CI',
    qrType: 'STATIC',
    referenceLabel: 'FACTURE_482',
  },
  {
    size: 360,
    logoDataUrl: DEFAULT_PISPI_LOGO_DATA_URL, // optionnel, c'est la valeur par défaut
  }
);

// svg contient le code SVG complet (string) que vous pouvez afficher ou convertir en image.
```

### Validation d’une payload existante

```ts
import { isValidPispiQrPayload } from '@pi-spi/qrcode';

const result = isValidPispiQrPayload(payload);

if (result.valid) {
  console.log('Payload valide', result.data);
} else {
  console.error('Payload invalide', result.errors);
}
```