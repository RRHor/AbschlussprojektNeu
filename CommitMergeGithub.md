# Git Commit & Merge – Wichtige Hinweise

## Committen

- Vor jedem Merge sollten alle Änderungen gespeichert und committed sein:
  ```bash
  git add .
  git commit -m "Beschreibung der Änderung"
  ```

## Mergen

- Wechsle auf den Ziel-Branch (z.B. `main`):
  ```bash
  git checkout main
  git pull
  ```
- Führe den Merge aus:
  ```bash
  git merge <feature-branch>
  ```
- Löse ggf. Konflikte, committe die Lösung und pushe:
  ```bash
  git add <datei>
  git commit -m "Konflikte gelöst"
  git push
  ```

## Branch nach dem Merge weiterverwenden

- Ein gemergter Branch kann weiter genutzt werden.
- Neue Commits auf diesem Branch können später erneut gemergt werden.
- Bereits gemergte Änderungen werden beim erneuten Merge nicht doppelt übernommen.

**Fazit:**  
Du kannst einen Branch nach dem Merge weiterverwenden und beliebig oft erneut mergen, solange neue Änderungen darauf gemacht werden.
```