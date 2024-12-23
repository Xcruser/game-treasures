# GameTreasures

Eine moderne Plattform für den Handel mit In-Game Items, entwickelt mit Next.js 13+, TypeScript und Tailwind CSS.

## Features

### Navigation & UI
- Moderne, responsive Navbar mit Glaseffekt-Design
- Dynamische Suchfunktion mit Echtzeit-Ergebnissen
- Warenkorb-System mit visueller Feedback
- Benutzerauthentifizierung

### Design-System
- Dunkles Theme mit subtilen Blautönen
- Glassmorphismus-Effekte
- Responsive Design für alle Geräten
- Moderne UI-Komponenten mit Hover-Effekten

## Technologie-Stack

- **Frontend Framework:** Next.js 13+
- **Sprache:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **Komponenten:** Custom React Components

## Komponenten

### Navbar (`/src/components/Navbar.tsx`)
- Responsive Navigation
- Integrierte Suchfunktion
- Warenkorb-Anzeige
- Benutzer-Authentifizierung

### SearchBar (`/src/components/SearchBar.tsx`)
- Echtzeit-Suche mit Debouncing
- Dropdown mit Suchergebnissen
- Responsive Design
- Keyboard Navigation (geplant)

### Custom Hooks
- `useDebounce`: Optimiert Suchanfragen

## Styling

### Farbschema
```typescript
// Hauptfarben
background: {
  DEFAULT: '#000008',    // Sehr dunkles Blauschwarz
  secondary: '#00000f',  // Etwas mehr Blau
  tertiary: '#000016',   // Noch etwas mehr Blau
}

// Akzentfarben
- Cyan/Blau Verläufe für Highlights
- Glaseffekte mit subtiler Transparenz
```

### Glaseffekt-System
- Subtile Transparenz
- Weicher Blur-Effekt
- Dezente Borders
- Sanfte Schatten

## Installation

1. Repository klonen:
```bash
git clone [repository-url]
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Entwicklungsserver starten:
```bash
npm run dev
```

## Geplante Features

- [ ] Backend-Integration
- [ ] Erweiterte Suchfilter
- [ ] Benutzerprofile
- [ ] Item-Kategorisierung
- [ ] Bewertungssystem

## Mitwirken

Beiträge sind willkommen! Bitte lesen Sie unsere Beitragsrichtlinien für weitere Informationen.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.
