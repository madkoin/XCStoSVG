# XCStoSVG (prod)

## Démarrage rapide (Docker)

Construire l'image:

```bash
docker build -t xcstosvg-prod .
```

Lancer le conteneur (port 8080 sur l'hôte):

```bash
docker run --rm -p 8082:80 xcstosvg-prod
```

Ouvrez ensuite: `http://localhost:8082/XCStoSVG-prod/`

Notes:
- Le projet est une application Vite avec `base` configurée sur `/XCStoSVG-prod/`.
- L'image finale utilise Nginx pour servir le contenu statique généré dans `dist`.
