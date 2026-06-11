# Ziffern-KI – Trainieren & Zahlen erkennen

Eine kleine Web-App, mit der du direkt im Browser ein neuronales Netz (CNN)
auf handgeschriebene Ziffern trainierst und danach **alle Zahlen in einem
Bild** erkennen lässt. Die erkannten Ziffern werden groß in einer Anzeige
dargestellt und im Bild grün markiert.

Es ist **keine Installation** nötig – kein Python, kein npm. Alles läuft mit
[TensorFlow.js](https://www.tensorflow.org/js) im Browser.

## Starten

**Variante 1 (am einfachsten):** Die Datei `digit-ai/index.html` per
Doppelklick im Browser öffnen (Chrome, Edge oder Firefox).

**Variante 2 (über den Dev-Server der Website):**

```bash
npm install
npm run dev
```

Dann im Browser `http://localhost:5173/digit-ai/index.html` öffnen.

> Für das Laden der Trainingsdaten und der TensorFlow.js-Bibliothek wird
> eine Internetverbindung benötigt.

## Bedienung

1. **Trainingsdaten laden** – lädt den MNIST-Datensatz
   (65.000 Bilder handgeschriebener Ziffern, ca. 10 MB).
2. **KI trainieren** – Modus, Anzahl der Trainingsbilder und Epochen
   wählen und das Training starten. Der Fortschritt und die Genauigkeit
   werden live angezeigt. Mit den Standardwerten (Turbo, 15.000 Bilder,
   5 Epochen) erreicht das Netz nach 1–2 Minuten etwa 98–99 %
   Testgenauigkeit. Mehr Bilder und Epochen = bessere Erkennung.
   - **Standard:** kleines, schnelles Netz (gut zum Ausprobieren).
   - **⚡ Turbo:** größeres Netz mit Batch-Normalisierung,
     One-Cycle-Lernraten-Fahrplan und Batch-Größe 256 – lernt schneller
     pro Epoche und erreicht höhere Genauigkeit.
3. **Modell speichern / laden** – das trainierte Modell im Browser
   speichern oder als Datei herunterladen. So musst du nur **einmal**
   trainieren und kannst es beim nächsten Mal einfach wieder laden.
4. **Zahlen erkennen** – Ziffern in das schwarze Feld zeichnen oder ein
   Foto/Bild mit Zahlen hochladen. Die App findet automatisch alle
   Ziffern im Bild, erkennt sie und zeigt das Ergebnis groß an –
   inklusive Sicherheit (in %) pro Ziffer.

## Tipps für gute Erkennung

- Dunkle Ziffern auf hellem Hintergrund (oder umgekehrt) funktionieren
  am besten.
- Die Ziffern sollten sich nicht berühren – etwas Abstand lassen.
- Das Netz ist auf **Ziffern (0–9)** trainiert, nicht auf Buchstaben.
- Wenn die Erkennung noch unsicher ist: einfach mit mehr Bildern
  (z. B. 55.000) und mehr Epochen (z. B. 10) weitertrainieren.

## Technik

- **Modell:** Convolutional Neural Network (2 Conv- + Pooling-Schichten,
  Dense-Schicht mit Dropout, Softmax-Ausgabe für 10 Klassen). Im
  Turbo-Modus zusätzlich Batch-Normalisierung nach jeder Schicht.
- **Training:** Adam-Optimizer, Kreuzentropie-Verlust, live im Browser.
  Rechen-Backend automatisch: WebGPU → WebGL → CPU (das aktive Backend
  wird oben auf der Seite angezeigt). Im Turbo-Modus mit
  One-Cycle-Lernraten-Schedule und Batch-Größe 256.
- **Layout:** responsiv, funktioniert auch auf dem Handy.
- **Mehrere Ziffern pro Bild:** Das Bild wird per Otsu-Schwellenwert
  binarisiert, zusammenhängende Bereiche werden gefunden
  (Connected-Component-Analyse), einzeln wie MNIST-Bilder aufbereitet
  (auf 20 px skaliert, am Schwerpunkt in 28×28 zentriert) und dann vom
  Netz klassifiziert.
