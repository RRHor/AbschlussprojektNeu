# Konflikte auf GitHub lösen – Schritt für Schritt

## 1. Pull Request erstellen
- Erstelle einen Pull Request (PR) von deinem Feature-Branch auf den Ziel-Branch (z.B. `main`).
- GitHub prüft automatisch, ob es Konflikte gibt.

## 2. Konfliktanzeige im Pull Request
- Wenn Konflikte bestehen, zeigt GitHub eine Warnung wie "This branch has conflicts that must be resolved".

## 3. Konflikte im Browser lösen
1. Klicke im PR auf **"Resolve conflicts"**.
2. GitHub zeigt die betroffenen Dateien mit Markierungen:
   - `<<<<<<< HEAD`
   - `=======`
   - `>>>>>>> branchname`
3. Entferne die Markierungen und entscheide, welche Änderungen übernommen werden sollen.
4. Speichere die Datei(en) und klicke auf **"Mark as resolved"**.

## 4. Merge abschließen
- Nach dem Lösen aller Konflikte kannst du auf **"Commit merge"** klicken.
- Danach kannst du den Pull Request wie gewohnt mergen (z.B. mit "Merge pull request").

---

**Tipp:**  
- Prüfe nach dem Merge, ob die Anwendung wie erwartet funktioniert.
- Bei vielen oder komplexen Konflikten kann es sinnvoller sein, die Konflikte lokal zu lösen und dann