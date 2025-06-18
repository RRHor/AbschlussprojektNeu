import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite-Konfiguration für das React-Frontend-Projekt
export default defineConfig({
  plugins: [react()], // Aktiviert das React-Plugin für Vite (JSX, Fast Refresh etc.)
  server: {
    // Proxy-Einstellungen für die lokale Entwicklung:
    // Alle Requests, die mit /api beginnen, werden an das Backend weitergeleitet.
    // So kannst du im Frontend einfach /api/... aufrufen, ohne CORS-Probleme.
    proxy: {
      '/api': 'http://localhost:4000' // Ziel-Backend (Port ggf. anpassen)
    }
  }
})
