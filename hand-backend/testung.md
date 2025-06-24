Hier ist eine **Übersicht aller typischen Endpunkte** deiner Anwendung (basierend auf deiner `server.js`) – **inklusive Beispieldaten und Schritt-für-Schritt-Anleitung für Thunder Client**:

---

## **1. Registrierung & Authentifizierung**

### **User registrieren**
- **POST** `/api/auth/register`
- **Body (JSON):**
    ```json
    {
      "nickname": "Max",
      "email": "max@example.com",
      "password": "geheim123",
      "adress": "ADRESS_OBJECTID" // Falls du Adressen als eigene Collection hast
    }
    ```
- **Thunder Client:**  
  - Wähle POST  
  - URL: `http://localhost:3000/api/auth/register`  
  - Body: JSON wie oben  
  - Sende Request

---

### **E-Mail verifizieren**
- **POST** `/api/auth/verify`
- **Body (JSON):**
    ```json
    {
      "email": "max@example.com",
      "code": "123456"
    }
    ```
- **Thunder Client:**  
  - Wähle POST  
  - URL: `http://localhost:3000/api/auth/verify`  
  - Body: JSON wie oben  
  - Sende Request

---

### **Login**
- **POST** `/api/auth/login`
- **Body (JSON):**
    ```json
    {
      "email": "max@example.com",
      "password": "geheim123"
    }
    ```
- **Thunder Client:**  
  - Wähle POST  
  - URL: `http://localhost:3000/api/auth/login`  
  - Body: JSON wie oben  
  - Sende Request  
  - **Merke dir das erhaltene Token!**

---

### **Eigene Userdaten abrufen**
- **GET** `/api/auth/users/me`
- **Header:**  
    `Authorization: Bearer <TOKEN>`
- **Thunder Client:**  
  - Wähle GET  
  - URL: `http://localhost:3000/api/auth/users/me`  
  - Header:  
    ```
    Authorization: Bearer <TOKEN>
    ```
  - Sende Request

---

### **Userdaten aktualisieren**
- **PUT** `/api/auth/users/:id`
- **Header:**  
    `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
    ```json
    {
      "nickname": "NeuerName"
    }
    ```
- **Thunder Client:**  
  - Wähle PUT  
  - URL: `http://localhost:3000/api/auth/users/<USER_ID>`  
  - Header:  
    ```
    Authorization: Bearer <TOKEN>
    ```
  - Body: JSON wie oben  
  - Sende Request

---

## **2. Blog**

### **Blogpost erstellen**
- **POST** `/api/blog`
- **Header:**  
    `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
    ```json
    {
      "title": "Mein erster Blogpost",
      "description": "Das ist der Inhalt.",
      "tags": ["Nachbarschaft", "Flohmarkt"],
      "images": ["bild1.jpg"]
    }
    ```
- **Thunder Client:**  
  - Wähle POST  
  - URL: `http://localhost:3000/api/blog`  
  - Header:  
    ```
    Authorization: Bearer <TOKEN>
    ```
  - Body: JSON wie oben  
  - Sende Request

---

### **Alle Blogposts abrufen**
- **GET** `/api/blog`
- **Thunder Client:**  
  - Wähle GET  
  - URL: `http://localhost:3000/api/blog`  
  - Sende Request

---

## **3. Kleinanzeigen (Ads)**

### **Anzeige erstellen**
- **POST** `/api/ads`
- **Header:**  
    `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
    ```json
    {
      "title": "Biete Fahrrad",
      "description": "Gut erhaltenes Fahrrad zu verkaufen.",
      "type": "biete",
      "tags": ["Fahrrad", "Verkauf"]
    }
    ```
- **Thunder Client:**  
  - Wähle POST  
  - URL: `http://localhost:3000/api/ads`  
  - Header:  
    ```
    Authorization: Bearer <TOKEN>
    ```
  - Body: JSON wie oben  
  - Sende Request

---

### **Alle Anzeigen abrufen**
- **GET** `/api/ads`
- **Thunder Client:**  
  - Wähle GET  
  - URL: `http://localhost:3000/api/ads`  
  - Sende Request

---

## **4. Events**

### **Event erstellen**
- **POST** `/api/events`
- **Header:**  
    `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
    ```json
    {
      "title": "Straßenfest",
      "description": "Kommt alle vorbei!",
      "date": "2025-07-01T18:00:00.000Z",
      "location": "Hauptstraße 1"
    }
    ```
- **Thunder Client:**  
  - Wähle POST  
  - URL: `http://localhost:3000/api/events`  
  - Header:  
    ```
    Authorization: Bearer <TOKEN>
    ```
  - Body: JSON wie oben  
  - Sende Request

---

### **Alle Events abrufen**
- **GET** `/api/events`
- **Thunder Client:**  
  - Wähle GET  
  - URL: `http://localhost:3000/api/events`  
  - Sende Request

---

## **5. Kommentare**

### **Kommentar erstellen**
- **POST** `/api/comments`
- **Header:**  
    `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
    ```json
    {
      "text": "Toller Beitrag!",
      "post": "BLOG_ODER_AD_ODER_EVENT_ID"
    }
    ```
- **Thunder Client:**  
  - Wähle POST  
  - URL: `http://localhost:3000/api/comments`  
  - Header:  
    ```
    Authorization: Bearer <TOKEN>
    ```
  - Body: JSON wie oben  
  - Sende Request

---

### **Kommentare zu einem Post abrufen**
- **GET** `/api/comments/post/:postId`
- **Thunder Client:**  
  - Wähle GET  
  - URL: `http://localhost:3000/api/comments/post/<POST_ID>`  
  - Sende Request

---

## **6. Adresse (falls als eigene Collection)**

### **Adresse für User anlegen**
- **POST** `/api/users/me/adress`
- **Header:**  
    `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
    ```json
    {
      "street": "Musterstraße 1",
      "city": "Musterstadt",
      "state": "NRW",
      "zipCode": 12345
    }
    ```
- **Thunder Client:**  
  - Wähle POST  
  - URL: `http://localhost:3000/api/users/me/adress`  
  - Header:  
    ```
    Authorization: Bearer <TOKEN>
    ```
  - Body: JSON wie oben  
  - Sende Request

---

## **7. Test-Email**
- **POST** `/api/test-email`
- **Body (JSON):**
    ```json
    {
      "email": "max@example.com",
      "code": "123456"
    }
    ```
- **Thunder Client:**  
  - Wähle POST  
  - URL: `http://localhost:3000/api/test-email`  
  - Body: JSON wie oben  
  - Sende Request

---

**Hinweise für Thunder Client:**
- Immer bei geschützten Routen das Token im Header setzen:  
  `Authorization: Bearer <TOKEN>`
- Body als **JSON** senden (Content-Type wird meist automatisch gesetzt).
- Die URLs ggf. an deinen Port anpassen (`localhost:3000` oder wie in deiner `.env` definiert).

---

**Wenn du zu einem Endpunkt ein Beispiel-Request oder eine Erklärung brauchst, sag einfach Bescheid!**- **Thunder Client:**  
  - Wähle POST  
  - URL: `http://localhost:3000/api/test-email`  
  - Body: JSON wie oben  
  - Sende Request

---

**Hinweise für Thunder Client:**
- Immer bei geschützten Routen das Token im Header setzen:  
  `Authorization: Bearer <TOKEN>`
- Body als **JSON** senden (Content-Type wird meist automatisch gesetzt).
- Die URLs ggf. an deinen Port anpassen (`localhost:3000` oder wie in deiner `.env` definiert).

---

**Wenn du zu einem Endpunkt ein Beispiel-Request oder eine Erklärung brauchst, sag einfach Bescheid!**






user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, // Verfasser des Kommentars