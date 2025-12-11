# Guide de déploiement - @pi-spi/qrcode

Ce guide explique comment déployer le package `@pi-spi/qrcode` sur npm pour qu'il soit accessible via jsDelivr CDN.

## Prérequis

1. **Compte npm** : Vous devez avoir un compte npm et être membre de l'organisation `@pi-spi`
   - Créer un compte : https://www.npmjs.com/signup
   - Demander l'accès à l'organisation `@pi-spi` si nécessaire

2. **Authentification npm** : Connectez-vous à npm via la ligne de commande
   ```bash
   npm login
   ```

## Étapes de déploiement

### 1. Préparer le build

Assurez-vous que tous les fichiers sont à jour et que les tests passent :

```bash
# Installer les dépendances
npm install

# Exécuter les tests
npm test

# Vérifier les types TypeScript
npm run typecheck

# Nettoyer les anciens builds
npm run clean

# Construire le package (génère dist/index.mjs, dist/index.cjs, dist/index.umd.js)
npm run build
```

### 2. Vérifier les fichiers générés

Après le build, vous devriez avoir dans le dossier `dist/` :
- `index.mjs` (format ESM)
- `index.cjs` (format CommonJS)
- `index.umd.js` (format UMD pour le navigateur)
- `index.d.ts` (définitions TypeScript)

Vérifiez que `dist/index.umd.js` existe et contient bien le code avec `PISPIQrcode` comme variable globale.

### 3. Vérifier la version

Avant de publier, vérifiez que la version dans `package.json` est correcte :
- Version actuelle : `0.3.1`
- Si vous faites des modifications, incrémentez la version selon [Semantic Versioning](https://semver.org/) :
  - `0.3.1` → `0.3.2` (patch : corrections de bugs)
  - `0.3.1` → `0.4.0` (minor : nouvelles fonctionnalités)
  - `0.3.1` → `1.0.0` (major : changements incompatibles)

### 4. Vérifier les fichiers à publier

Le champ `"files"` dans `package.json` indique que seul le dossier `dist/` sera publié. Vérifiez que c'est bien ce que vous voulez :

```json
"files": [
  "dist"
]
```

### 5. Test de publication en mode dry-run

Avant de publier réellement, testez avec `--dry-run` pour voir ce qui sera publié :

```bash
npm publish --dry-run
```

Cela affichera :
- Les fichiers qui seront inclus dans le package
- La taille du package
- Les métadonnées qui seront publiées

### 6. Publier sur npm

Une fois que tout est prêt :

```bash
# Pour une publication publique
npm publish --access public
```

**Note importante** : Pour les packages avec scope (`@pi-spi/`), vous devez spécifier `--access public` lors de la première publication, ou configurer l'accès par défaut :

```bash
npm config set access public
npm publish
```

### 7. Vérifier la publication

Après publication, vérifiez que le package est bien disponible :

1. **Sur npm** : https://www.npmjs.com/package/@pi-spi/qrcode
2. **Via jsDelivr** (peut prendre quelques minutes pour l'indexation) :
   - Dernière version : https://cdn.jsdelivr.net/npm/@pi-spi/qrcode@latest/dist/index.umd.js
   - Version spécifique : https://cdn.jsdelivr.net/npm/@pi-spi/qrcode@0.3.1/dist/index.umd.js

### 8. Tester le CDN

Créez un fichier HTML de test pour vérifier que le package fonctionne via jsDelivr :

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test CDN @pi-spi/qrcode</title>
</head>
<body>
    <h1>Test CDN</h1>
    <div id="qr-container"></div>
    
    <script src="https://cdn.jsdelivr.net/npm/@pi-spi/qrcode@latest/dist/index.umd.js"></script>
    <script>
        console.log('PISPIQrcode disponible ?', typeof PISPIQrcode !== 'undefined');
        
        if (typeof PISPIQrcode !== 'undefined') {
            // Test de génération de payload
            const payload = PISPIQrcode.buildPayloadString({
                alias: '3497a720-ab11-4973-9619-534e04f263a1',
                countryCode: 'CI',
                qrType: 'STATIC',
                referenceLabel: 'TEST_CDN',
                amount: 1000,
            });
            
            console.log('Payload générée:', payload);
            
            // Test de génération de QR Code SVG
            PISPIQrcode.generateQrCodeSvg({
                alias: '3497a720-ab11-4973-9619-534e04f263a1',
                countryCode: 'CI',
                qrType: 'DYNAMIC',
                referenceLabel: 'TEST_CDN',
                amount: 2000,
            }, {
                size: 300
            }).then(svg => {
                document.getElementById('qr-container').innerHTML = svg;
                console.log('QR Code généré avec succès !');
            }).catch(err => {
                console.error('Erreur lors de la génération du QR Code:', err);
            });
        } else {
            console.error('PISPIQrcode n\'est pas disponible !');
        }
    </script>
</body>
</html>
```

## Mise à jour d'une version existante

Pour publier une nouvelle version :

1. Modifiez la version dans `package.json`
2. Rebuild : `npm run build`
3. Testez : `npm test`
4. Publiez : `npm publish`

## Commandes utiles

```bash
# Voir les informations du package publié
npm view @pi-spi/qrcode

# Voir les versions publiées
npm view @pi-spi/qrcode versions

# Voir la dernière version
npm view @pi-spi/qrcode version

# Dépublier une version (dans les 72 heures)
npm unpublish @pi-spi/qrcode@0.3.1
```

## URLs jsDelivr

Une fois publié, le package sera accessible via :

- **Dernière version** : `https://cdn.jsdelivr.net/npm/@pi-spi/qrcode@latest/dist/index.umd.js`
- **Version spécifique** : `https://cdn.jsdelivr.net/npm/@pi-spi/qrcode@0.3.0/dist/index.umd.js`
- **Version avec tag** : `https://cdn.jsdelivr.net/npm/@pi-spi/qrcode@0.3/dist/index.umd.js`

## Notes importantes

1. **Indexation jsDelivr** : Après publication sur npm, jsDelivr peut prendre quelques minutes à quelques heures pour indexer le nouveau package. Si le package n'est pas immédiatement disponible, attendez un peu et réessayez.

2. **Cache** : jsDelivr utilise un CDN avec cache. Les mises à jour peuvent prendre quelques minutes à se propager.

3. **Sécurité** : Ne publiez jamais de tokens, clés API ou informations sensibles dans le package.

4. **Documentation** : Assurez-vous que le README.md est à jour avant de publier, car il sera affiché sur la page npm du package.
