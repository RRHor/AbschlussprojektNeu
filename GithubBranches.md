# Git Branch-Workflow: Branches erstellen, mergen & Konflikte lösen

## 1. Neuen Branch erstellen und wechseln
```bash
git checkout -b <branchname>
```

## 2. Änderungen vornehmen und committen
```bash
git add .
git commit -m "Beschreibung der Änderungen"
```

## 3. Branch mit Remote-Repository verknüpfen (nur 1mal  '-u origin <branchname>' notwendig)
```bash
git push -u origin <branchname>
```

## 4. Pull Request erstellen
- Gehe zu deinem Repository auf GitHub.
- Klicke auf "Compare & pull request".
- Füge eine Beschreibung hinzu und klicke auf "Create pull request".

## 5. Code überprüfen und mergen
- Überprüfe die Änderungen im Pull Request.
- Klicke auf "Merge pull request", um die Änderungen zu übernehmen.

## 6. Lokalen Branch aktualisieren
```bash
git checkout main
git pull origin main
```

## 7. Branch löschen (optional)
```bash
git branch -d <branchname>
git push origin --delete <branchname>
```

## Hinweise
- Stelle sicher, dass du regelmäßig deinen `main`-Branch aktualisierst.
- Löse Konflikte, falls vorhanden, bevor du den Pull Request erstellst.





