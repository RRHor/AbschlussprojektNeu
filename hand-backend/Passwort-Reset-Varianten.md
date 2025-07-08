# Passwort-Reset-Flow: Zwei Varianten für alle Teams

## Ziel
Damit alle Teammitglieder (z.B. Rea und du) ihren bevorzugten Passwort-Reset-Flow nutzen können, gibt es zwei Varianten:

- **Variante 1:** 6-stelliger Code per E-Mail (klassisch)
- **Variante 2:** Reset-Link mit Token (modern)

Ihr könnt beide Varianten parallel anbieten – je nach Bedarf und Vorliebe.

---

## Schritt-für-Schritt-Anleitung

### 1. Endpunkte im Backend

- `/api/forgot-password-code` → Sendet einen 6-stelligen Code per E-Mail
- `/api/forgot-password-token` → Sendet einen Reset-Link mit Token per E-Mail

### 2. Ablauf für den 6-stelligen Code (dein Flow)
1. **POST** an `/api/forgot-password-code` mit:
   ```json
   { "email": "user@example.com" }
   ```
2. User erhält eine E-Mail mit einem 6-stelligen Code.
3. **POST** an `/api/auth/reset-password` mit:
   ```json
   {
     "email": "user@example.com",
     "resetCode": "123456",
     "newPassword": "neuesPasswort123"
   }
   ```

### 3. Ablauf für den Token-Link (Reas Flow)
1. **POST** an `/api/forgot-password-token` mit:
   ```json
   { "email": "user@example.com" }
   ```
2. User erhält eine E-Mail mit einem Link wie `/api/reset-password/:token`.
3. **POST** an `/api/reset-password/:token` mit:
   ```json
   {
     "newPassword": "neuesPasswort123",
     "confirmPassword": "neuesPasswort123"
   }
   ```

---

## Wie kann man beide Flows parallel anbieten?

Ihr könnt beide Passwort-Reset-Varianten parallel im Projekt nutzen – so bleibt der Code übersichtlich und jeder kann „seinen“ Weg nutzen, ohne dass es zu Konflikten kommt:

### 1. Über Konfiguration (Feature-Flag)
- In der `.env`-Datei kann z.B. `RESET_FLOW=code` oder `RESET_FLOW=token` gesetzt werden.
- Im Backend prüft der Code diese Variable und entscheidet, welcher Flow aktiv ist.

### 2. Über getrennte Endpunkte
- Zwei verschiedene Routen im Backend:
  - `/api/forgot-password-code` für den 6-stelligen Code
  - `/api/forgot-password-token` für den Token-Link
- Das Frontend kann je nach Bedarf den passenden Endpunkt ansprechen.

### 3. Über saubere Modulauswahl
- Die Logik für beide Varianten ist in eigenen Modulen/Funktionen gekapselt.
- Je nach Projekt oder Team kann das passende Modul eingebunden werden.

**Vorteil:**
- Jeder kann den für sich passenden Flow nutzen.
- Keine ständigen Anpassungen oder Konflikte im Team.
- Die Codebasis bleibt sauber und wartbar.

---

## Vorteile
- Jeder kann den für sich passenden Flow nutzen.
- Keine Konflikte mehr im Code oder im Team.
- Die Logik bleibt übersichtlich und wartbar.

---

## Hinweise
- Die Endpunkte können im Frontend je nach User-Auswahl oder Projektkonfiguration genutzt werden.
- Die Implementierung ist im Backend dokumentiert und kann bei Bedarf erweitert werden.

**Fragen? Einfach im Team oder bei GitHub Copilot nachfragen!**
