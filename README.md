# Game Treasures

Eine moderne Gaming-Shop-Anwendung, entwickelt mit Next.js 13+, React und Tailwind CSS.

## Features

- Dynamische Item-Anzeige mit Lazy Loading
- Modernes UI-Design mit Glasmorphismus-Effekten
- Responsive Suchfunktion (Desktop & Mobile)
- Integrierter Warenkorb
- Optimierte Performance durch:
  - Lazy Loading von Komponenten
  - Intersection Observer für Bildladung
  - Optimierte Next.js Image-Komponente
  - Progressive Loading States

## Technologie-Stack

- **Framework**: Next.js 13+
- **UI**: React & Tailwind CSS
- **Icons**: React Icons
- **Performance**: Next.js Image Optimization
- **Styling**: CSS Modules & Tailwind CSS

## Performance-Optimierungen

- Lazy Loading für Komponenten und Bilder
- Optimierte Bildgrößen und Formate
- Progressive Loading States
- Intersection Observer für verzögertes Laden
- Optimierte Metadaten für SEO

## Setup

1. Repository klonen:
```bash
git clone https://github.com/yourusername/game-treasures.git
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Entwicklungsserver starten:
```bash
npm run dev
```

4. Browser öffnen und zur Anwendung navigieren:
```
http://localhost:3000
```

## Projektstruktur

```
src/
├── app/                    # Next.js App Router
├── components/            # React Komponenten
│   ├── ItemCard.tsx      # Produkt-Karten
│   ├── Navbar.tsx        # Navigation
│   └── LoadingSpinner.tsx # Lade-Animation
├── styles/               # Globale Styles
└── types/                # TypeScript Definitionen
```

## Nächste Schritte

- [ ] Backend-Integration
- [ ] Authentifizierung
- [ ] Warenkorb-Funktionalität
- [ ] Zahlungsabwicklung
- [ ] Admin-Dashboard

## Lizenz

MIT
