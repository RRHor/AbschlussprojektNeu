# Übersicht aller API-Routen zum Testen in Thunder Client

## User-Routen

### Registrierung
- **POST** `/api/users/register`
- **Body:**
  ```json
  {
    "nickname": "Max",
    "email": "max@example.com",
    "password": "deinPasswort",
    "adress": "Musterstraße 1"
  }
  ```