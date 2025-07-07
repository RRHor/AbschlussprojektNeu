# API-Übersicht

## Authentifizierung

| Methode | Endpoint                  | Beschreibung                | Auth erforderlich |
|---------|--------------------------|-----------------------------|------------------|
| POST    | /api/auth/register       | User registrieren           | Nein             |
| POST    | /api/auth/login          | Login                       | Nein             |
| POST    | /api/auth/logout         | Logout (Dummy)              | Ja               |

## E-Mail-Verifizierung

| Methode | Endpoint                          | Beschreibung                        | Auth erforderlich |
|---------|-----------------------------------|-------------------------------------|------------------|
| POST    | /api/auth/request-verification    | Verifizierungscode anfordern        | Nein             |
| POST    | /api/auth/verify                  | Verifizierungscode prüfen           | Nein             |

## User-Daten

| Methode | Endpoint                  | Beschreibung                | Auth erforderlich |
|---------|---------------------------|-----------------------------|------------------|
| GET     | /api/auth/users/me        | Eigene Userdaten abrufen    | Ja               |
| PUT     | /api/auth/users/:id       | Userdaten aktualisieren     | Ja               |

## Erweiterungsideen

| Methode | Endpoint                  | Beschreibung                        | Auth erforderlich |
|---------|---------------------------|-------------------------------------|------------------|
| DELETE  | /api/auth/users/:id       | User löschen                        | Ja (Admin)       |
| GET     | /api/auth/users           | Alle User abrufen (Admin)           | Ja (Admin)       |
| PATCH   | /api/auth/users/:id/activate | User aktivieren/deaktivieren    | Ja (Admin)       |
| POST    | /api/auth/change-password | Passwort ändern                     | Ja               |
| POST    | /api/auth/forgot-password | Passwort vergessen/Reset            | Nein             |
| PATCH   | /api/auth/users/:id/role  | Rolle/Berechtigung ändern           | Ja (Admin)       |

---

## Hinweise

- **:id** steht für die User-ID.
- **Auth erforderlich:** Gibt an, ob ein gültiges JWT benötigt wird.
- Diese Tabelle kann beliebig erweitert werden (z.B. für weitere Models wie Posts, Nachrichten, etc.).

---

## ToDo

- [ ] Fehlende Routen ergänzen
- [ ] Beschreibung und Auth für jede Route prüfen
- [ ] Mit Frontend-Team abstimmen

Test Test Tes 