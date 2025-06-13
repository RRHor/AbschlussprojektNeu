Erstellen von einen GitHub Repository
git clone LINK (GitHub Repository ins Local clonen , nur einmal am Anfang)
git branch  (welche branches gibt es remote)
git status (welcher branch ist aktuell aktiv)
git branch <NEUER_NAME> ODER git branch -M <NEUER_NAME> (neuen git branch local erstellen)
Eure Änderungen/Programmieren
git add .
git commit -m "TEXT"
git push -u origin <NEUER_NAME> (Einmaliges synchronisieren von eurem neuen localen branch mit Remote Origin)
Der neue locale Branch existiert jetzt auch Remote auf GitHub
Überprüfen über das Dropdown in GitHub
Im zu mergenden Branch einen Git Pullrequest erstellen
Auto Merge abwarten (Able to merge)
Button Pull Request ausführen
Gemergeter Branch z.B. main/master/dev ist aktuell
Nächste Schritte z.B.:
git fetch (Überprüfen ob es neue Änderungen remote gibt)
git pull (Falls es Änderungen gibt, die Änderungen bei mir local updaten)
Theoretisch geht dieser Kreislauf immer wieder hin und her mit den neuen Änderungen/Branches/Merge