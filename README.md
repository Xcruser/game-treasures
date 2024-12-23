# GameTreasures

Eine moderne E-Commerce-Plattform für Monopoly Go Items, entwickelt mit Next.js 13 und Tailwind CSS.

## 🚀 Features

### UI/UX Verbesserungen
- **Dynamischer Hintergrund**: 
  - Animierte Gaming-Icons mit zufälligen, natürlichen Bewegungen
  - Automatische Aktualisierung der Bewegungsmuster alle 20 Sekunden
  - Sanfte Übergänge und unterschiedliche Animationsgeschwindigkeiten
  - Subtile Blur- und Opazitätseffekte für bessere Integration

- **Modernes Layout**:
  - Responsive Design mit Flexbox und Grid
  - Glasmorphismus-Effekte für UI-Elemente
  - Gradient-Texte und Hover-Effekte
  - Optimierte Abstände und Typografie

### Admin Dashboard
- **Benutzeroberfläche**:
  - Modernes, responsives Dashboard-Layout
  - Dynamische Statistiken und Übersichten
  - Echtzeit-Produktverwaltung
  - Bestellungs- und Kundenverwaltung

- **Features**:
  - Produktverwaltung mit CRUD-Operationen
  - Bestellungsübersicht und -verwaltung
  - Kundenmanagement
  - Statistiken und Analysen
  - Einstellungen und Konfiguration

### Performance
- Client-seitige Komponenten für optimale Interaktivität
- Lazy Loading für bessere Ladezeiten
- Optimierte Asset-Verwaltung
- Server-Side Rendering für bessere SEO

### Sicherheit
- Admin-Authentifizierung
- Sichere Zahlungsabwicklung
- Datenschutzkonforme Implementierung
- Verschlüsselte Kommunikation

## 🛠 Technologie-Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Animation**: Custom CSS Animations, React Hooks
- **State Management**: React Context
- **Datenbank**: PostgreSQL mit Prisma ORM

## 🗂 Projektstruktur

```
game-treasures/
├── src/              # Quellcode
│   ├── app/         # Next.js App Router
│   ├── components/  # React Komponenten
│   └── lib/         # Hilfsfunktionen und Utilities
├── public/          # Statische Assets
├── prisma/         # Datenbankschema und Migrationen
└── node_modules/   # Projektabhängigkeiten
```

## 💻 Entwicklungsumgebung

### Voraussetzungen
- Node.js (>= 18.0.0)
- npm oder yarn
- PostgreSQL
- Git

### Installation

1. Repository klonen:
```bash
git clone https://github.com/yourusername/game-treasures.git
cd game-treasures
```

2. Abhängigkeiten installieren:
```bash
npm install
```

3. Umgebungsvariablen einrichten:
```bash
cp .env.example .env.local
```

4. Datenbank einrichten:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Entwicklungsserver starten:
```bash
npm run dev
```

## 🔄 Letzte Updates

### Version 1.2.0 (23.12.2023)
- Implementierung des Admin Dashboards
- Verbesserte Produktverwaltung mit Echtzeit-Updates
- Layout-Optimierungen für bessere Benutzerfreundlichkeit
- Datenbankintegration mit Prisma
- Admin-Authentifizierung

### Version 1.1.0
- Implementierung des animierten Hintergrunds mit Gaming-Icons
- Verbessertes Layout-Design mit Glasmorphismus

## 📝 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.
