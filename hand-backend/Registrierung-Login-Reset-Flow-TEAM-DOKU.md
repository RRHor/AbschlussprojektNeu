# Registrierung, Login & Passwort-Reset – Team-Doku für Rea & dich

## Ziel
Diese Doku beschreibt den gesamten Authentifizierungs- und Passwort-Reset-Flow, so dass nach jedem Merge alles stabil bleibt und beide Teams (Rea & du) ihre bevorzugten Flows nutzen können – ohne dass der Code kaputt geht.

---

## 1. Registrierung

- **Endpoint:** `POST /api/auth/register`
- **Body:**
  ```json
  {
    "nickname": "Muh",
    "email": "muh@example.com",
    "password": "deinSicheresPasswort123",
    "addresses": [
      {
        "street": "Musterstraße 1",
        "city": "Musterstadt",
        "district": "Musterbezirk",
        "state": "NRW",
        "zipCode": 12345,
        "firstName": "Max",
        "lastName": "Mustermann"
      }
    ]
  }
  ```
- **Ablauf:**
  - User wird angelegt.
  - 6-stelliger Verifizierungscode wird generiert und per E-Mail verschickt (Code + Link).
  - User muss Code eingeben oder Link klicken, um das Konto zu aktivieren.

---

## 2. E-Mail-Verifizierung

- **Endpoint:** z.B. `GET /api/auth/verify-link?userId=...&code=...`
- **Ablauf:**
  - Code wird geprüft.
  - Nach Erfolg: `isVerify` auf `true` gesetzt.
  - Erst dann ist Login möglich.

---

## 3. Login

- **Endpoint:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "email": "muh@example.com",
    "password": "deinSicheresPasswort123"
  }
  ```
- **Ablauf:**
  - Login nur möglich, wenn `isVerify: true`.
  - Bei Erfolg gibt es ein JWT-Token zurück.

---

## 4. Passwort vergessen (Forgot Password)

- **Endpoint:** `POST /api/auth/forgot-password`
- **Body:**
  ```json
  {
    "email": "muh@example.com"
  }
  ```
- **Ablauf:**
  - Neuer 6-stelliger Reset-Code wird generiert und per E-Mail verschickt.
  - Die E-Mail enthält:
    - Den Code (deutlich hervorgehoben, zum Kopieren)
    - Einen Button/Link (Komfort)
    - Einen Sicherheitshinweis

---

## 5. Passwort zurücksetzen

- **Endpoint:** `POST /api/auth/reset-password`
- **Body:**
  ```json
  {
    "email": "muh@example.com",
    "resetCode": "123456",
    "newPassword": "neuesSicheresPasswort"
  }
  ```
- **Ablauf:**
  - Code wird geprüft (1 Stunde gültig).
  - Passwort wird sicher gehasht und gespeichert.
  - Nach Erfolg kann sich der User mit dem neuen Passwort einloggen.

---

## 6. Wichtige Merge-Regeln & Änderungen

- **User-Modell:**
  - Überall das gleiche Modell (`userSchema.js`) verwenden.
  - Keine doppelten oder abweichenden Felder!
- **Verifizierungs-Status:**
  - Immer auf `isVerify` prüfen (nicht `isVerified` oder andere Varianten).
- **E-Mail-Versand:**
  - Standard: globaler Nodemailer-Transporter mit `EMAIL_SERVICE` (z.B. Gmail).
  - Optional: klassischer SMTP-Transporter per `.env` (für Rea oder andere).
  - Beide Flows funktionieren parallel, ohne dass Code entfernt werden muss.
- **E-Mail-Inhalt:**
  - Code immer im Klartext + Link/Button + Sicherheitshinweis.
- **Keine harten Änderungen an bestehenden Endpunkten:**
  - Alle Flows stören sich nicht gegenseitig.
  - Feature-Flags oder getrennte Endpunkte können bei Bedarf ergänzt werden.

---

## 7. Best Practices für euer Team

- **Vor jedem Merge:**
  - Prüft, ob User-Modell und E-Mail-Logik identisch sind.
  - Keine Felder umbenennen oder entfernen, ohne Rücksprache!
- **Nach jedem Merge:**
  - Registrierung, Verifizierung, Login und Passwort-Reset einmal durchtesten (Postman reicht).
- **Dokumentation:**
  - Siehe `Warum-laeuft-es-jetzt.md` und `Passwort-Reset-Varianten.md` im Backend-Ordner für Details und Troubleshooting.

---

**Fazit:**
Mit dieser Struktur können Rea und du unabhängig arbeiten, ohne dass nach einem Merge etwas kaputt geht. Alles ist dokumentiert, getestet und flexibel – und kann bei Bedarf erweitert werden.
