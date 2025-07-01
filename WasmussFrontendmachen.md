
Was muss das Frontend machen, damit das Speichern klappt?

1. Wenn der User auf „Speichern“ klickt,
2. soll das Frontend die neuen Daten (z.B. neue Adresse) nehmen
3. und an das Backend schicken – mit einer sogenannten PUT-Anfrage.
4. Diese Anfrage muss den Token (eine Art Ausweis, den man beim Login bekommt) im Header mitschicken.
5. Das Backend speichert dann die neuen Daten in der Datenbank.

Kurz gesagt:
Beim Speichern muss das Frontend die neuen Daten und den Token an das Backend schicken.
Nur so werden die Änderungen wirklich gespeichert.




### Neues Passwort anfordern

Was muss das Frontend beim Passwort-Reset machen?

1. Passwort-vergessen (E-Mail eingeben)
    * Wenn der User seine E-Mail eingibt und auf „Passwort zurücksetzen“ klickt,
    * schickt das Frontend eine Anfrage an das Backend:
        * URL: ``http://localhost:4000/api/auth/forgot-password`
        * Methode: `POST`
        * Body:
```json
{ "email": "user@email.de" }
```
* Header:
        `Content-Type: application/json`

2. Neues Passwort setzen (mit Token)

* Wenn der User den Link aus der E-Mail klickt und ein neues Passwort eingibt,
* schickt das Frontend eine Anfrage an das Backend:
    * URL: `http://localhost:4000/api/auth/reset-password`
    * Methode: `POST`
    * Body: 
    ``` json
    {
    "token": "TOKEN_AUS_LINK",
    "newPassword": "NEUES_PASSWORT"
    }
```
* Header:
`Content-Type: application/json`

Wichtig:

* Der Body muss genau so aussehen wie oben.
* Der Header `Content-Type: application/json` muss immer dabei sein.
* Die URL muss stimmen.

Kurz gesagt:
Das Frontend soll beim Passwort-Reset genau die gleichen Daten schicken wie in Postman – dann klappt alles!

Wenn ihr Hilfe beim Code braucht, kann ich auch ein Beispiel für JavaScript (fetch) geben!