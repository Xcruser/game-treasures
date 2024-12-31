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
  - Bestellungs- und Benutzerverwaltung

- **Features**:
  - Vollständige Produktverwaltung (CRUD)
    - Produkte hinzufügen, bearbeiten und löschen
    - Bildupload und -verwaltung
    - Lagerbestandsverwaltung (inkl. "Unbegrenzt" Option)
  - Dashboard mit Statistiken
    - Produktübersicht
    - Bestellungsstatistiken
    - Umsatzübersicht
    - Benutzeraktivität
  - Benutzerverwaltung
    - Benutzer erstellen und bearbeiten
    - Rollenverwaltung (Admin/User)
    - Passwortmanagement
  - Schnellzugriff auf wichtige Funktionen
    - "Produkt hinzufügen" direkt vom Dashboard
    - Letzte Produktaktualisierungen
    - Aktivitätsübersicht

### Performance
- Client-seitige Komponenten für optimale Interaktivität
- Lazy Loading für bessere Ladezeiten
- Optimierte Asset-Verwaltung
- Server-Side Rendering für bessere SEO

### Sicherheit
- Admin-Authentifizierung
- Sichere Zahlungsabwicklung
- Datenschutzkonforme Implementierung

## 🔧 Letzte Änderungen

### Version 1.0.1 (24.12.2023)
- **Fehlerbehebungen**:
  - Korrektur des Prisma-Client-Imports für bessere Modularität
  - Behebung von Dashboard-Statistiken-Fehlern
  - Aktualisierung der Benutzerverwaltung-Terminologie
  - Verbesserung der Admin-Navigation

- **Verbesserungen**:
  - Optimierung der Benutzeroberfläche im Admin-Bereich
  - Aktualisierung der Statistik-Berechnungen
  - Verbesserung der Fehlerbehandlung in API-Routen

## 🛠 Installation

1. Repository klonen
```bash
git clone https://github.com/yourusername/game-treasures.git
```

2. Abhängigkeiten installieren
```bash
npm install
```

3. Umgebungsvariablen einrichten
```bash
cp .env.example .env.local
```

4. Entwicklungsserver starten
```bash
npm run dev
```

## 📝 Umgebungsvariablen

Erstellen Sie eine `.env.local` Datei mit folgenden Variablen:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 🤝 Mitwirken

Beiträge sind willkommen! Bitte lesen Sie unsere Beitragsrichtlinien.
