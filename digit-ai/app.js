/* Ziffern-KI: trainiert ein CNN auf MNIST und erkennt danach
   alle Ziffern in einem Bild (Zeichnung oder Upload). */

const tf = window.tf;

// ---------- MNIST-Datensatz ----------

const BILD_GROESSE = 784; // 28 x 28
const ANZAHL_KLASSEN = 10;
const ANZAHL_GESAMT = 65000;
const ANZAHL_TRAINING = 55000;

const MNIST_BILDER_URL =
  'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png';
const MNIST_LABELS_URL =
  'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8';

class MnistDaten {
  async laden() {
    const img = new Image();
    const bilderGeladen = new Promise((resolve, reject) => {
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const puffer = new ArrayBuffer(ANZAHL_GESAMT * BILD_GROESSE * 4);
        const blockGroesse = 5000;
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = blockGroesse;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        for (let i = 0; i < ANZAHL_GESAMT / blockGroesse; i++) {
          const ansicht = new Float32Array(
            puffer, i * BILD_GROESSE * blockGroesse * 4, BILD_GROESSE * blockGroesse);
          ctx.drawImage(
            img, 0, i * blockGroesse, img.naturalWidth, blockGroesse,
            0, 0, canvas.width, canvas.height);
          const pixel = ctx.getImageData(0, 0, canvas.width, canvas.height);
          for (let j = 0; j < pixel.data.length / 4; j++) {
            ansicht[j] = pixel.data[j * 4] / 255;
          }
        }
        this.bilder = new Float32Array(puffer);
        resolve();
      };
      img.onerror = () => reject(new Error('MNIST-Bilddatei konnte nicht geladen werden.'));
      img.src = MNIST_BILDER_URL;
    });

    const labelAntwort = await fetch(MNIST_LABELS_URL);
    if (!labelAntwort.ok) throw new Error('MNIST-Labels konnten nicht geladen werden.');
    this.labels = new Uint8Array(await labelAntwort.arrayBuffer());
    await bilderGeladen;
  }

  // Liefert [xs, ys] als Tensoren für eine zufällige Teilmenge.
  holeTensoren(anzahl, ausTestmenge) {
    const start = ausTestmenge ? ANZAHL_TRAINING : 0;
    const umfang = ausTestmenge ? ANZAHL_GESAMT - ANZAHL_TRAINING : ANZAHL_TRAINING;
    anzahl = Math.min(anzahl, umfang);

    const indizes = tf.util.createShuffledIndices(umfang);
    const xs = new Float32Array(anzahl * BILD_GROESSE);
    const ys = new Uint8Array(anzahl * ANZAHL_KLASSEN);
    for (let i = 0; i < anzahl; i++) {
      const idx = start + indizes[i];
      xs.set(this.bilder.subarray(idx * BILD_GROESSE, (idx + 1) * BILD_GROESSE),
        i * BILD_GROESSE);
      ys.set(this.labels.subarray(idx * ANZAHL_KLASSEN, (idx + 1) * ANZAHL_KLASSEN),
        i * ANZAHL_KLASSEN);
    }
    return [
      tf.tensor4d(xs, [anzahl, 28, 28, 1]),
      tf.tensor2d(ys, [anzahl, ANZAHL_KLASSEN]),
    ];
  }
}

// ---------- Modell ----------

function erstelleModell() {
  const modell = tf.sequential();
  modell.add(tf.layers.conv2d({
    inputShape: [28, 28, 1], kernelSize: 5, filters: 8, activation: 'relu',
  }));
  modell.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
  modell.add(tf.layers.conv2d({ kernelSize: 5, filters: 16, activation: 'relu' }));
  modell.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
  modell.add(tf.layers.flatten());
  modell.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  modell.add(tf.layers.dropout({ rate: 0.25 }));
  modell.add(tf.layers.dense({ units: ANZAHL_KLASSEN, activation: 'softmax' }));
  kompiliere(modell);
  return modell;
}

function kompiliere(modell) {
  modell.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
}

// ---------- Zustand & UI-Elemente ----------

const daten = new MnistDaten();
let datenGeladen = false;
let modell = null;

const el = (id) => document.getElementById(id);
const btnDaten = el('btnDaten');
const btnTraining = el('btnTraining');
const btnSpeichern = el('btnSpeichern');
const btnLadenBrowser = el('btnLadenBrowser');
const btnDownload = el('btnDownload');
const btnErkennenZeichnung = el('btnErkennenZeichnung');
const btnLoeschen = el('btnLoeschen');
const bildUpload = el('bildUpload');
const statusText = el('statusText');
const trainStatus = el('trainStatus');
const balken = el('balken');
const ergebnisAnzeige = el('ergebnis');
const detailsAnzeige = el('details');

const SPEICHER_PFAD = 'indexeddb://ziffern-modell';

function aktiviereErkennung() {
  btnSpeichern.disabled = false;
  btnDownload.disabled = false;
  btnErkennenZeichnung.disabled = false;
  bildUpload.disabled = false;
}

// ---------- Daten laden ----------

btnDaten.addEventListener('click', async () => {
  btnDaten.disabled = true;
  statusText.textContent = 'Lade MNIST-Daten … (ca. 10 MB)';
  try {
    await daten.laden();
    datenGeladen = true;
    btnTraining.disabled = false;
    statusText.textContent = '✅ 65.000 Trainingsbilder geladen.';
  } catch (fehler) {
    statusText.textContent = '❌ ' + fehler.message + ' (Internetverbindung prüfen)';
    btnDaten.disabled = false;
  }
});

// ---------- Training ----------

const chart = el('chart');
const chartCtx = chart.getContext('2d');
let genauigkeitsVerlauf = [];

function zeichneChart() {
  const w = chart.width, h = chart.height;
  chartCtx.clearRect(0, 0, w, h);
  chartCtx.strokeStyle = '#334155';
  chartCtx.strokeRect(0.5, 0.5, w - 1, h - 1);
  chartCtx.fillStyle = '#94a3b8';
  chartCtx.font = '12px sans-serif';
  chartCtx.fillText('Genauigkeit während des Trainings (0 % – 100 %)', 10, 16);
  if (genauigkeitsVerlauf.length < 2) return;
  chartCtx.strokeStyle = '#22c55e';
  chartCtx.lineWidth = 2;
  chartCtx.beginPath();
  genauigkeitsVerlauf.forEach((acc, i) => {
    const x = 10 + (i / (genauigkeitsVerlauf.length - 1)) * (w - 20);
    const y = h - 10 - acc * (h - 40);
    if (i === 0) chartCtx.moveTo(x, y); else chartCtx.lineTo(x, y);
  });
  chartCtx.stroke();
}

btnTraining.addEventListener('click', async () => {
  if (!datenGeladen) return;
  const anzahl = Math.max(1000, Math.min(55000, parseInt(el('anzahlBilder').value, 10) || 15000));
  const epochen = Math.max(1, Math.min(50, parseInt(el('epochen').value, 10) || 5));

  btnTraining.disabled = true;
  btnDaten.disabled = true;
  genauigkeitsVerlauf = [];
  zeichneChart();

  if (!modell) modell = erstelleModell();

  const [xs, ys] = daten.holeTensoren(anzahl, false);
  const [testXs, testYs] = daten.holeTensoren(2000, true);

  const batchGroesse = 128;
  const batchesProEpoche = Math.ceil(anzahl / batchGroesse);
  const batchesGesamt = batchesProEpoche * epochen;
  let fertigeBatches = 0;

  trainStatus.textContent = 'Training läuft …';
  try {
    await modell.fit(xs, ys, {
      epochs: epochen,
      batchSize: batchGroesse,
      shuffle: true,
      validationData: [testXs, testYs],
      callbacks: {
        onBatchEnd: (batch, logs) => {
          fertigeBatches++;
          balken.style.width = ((fertigeBatches / batchesGesamt) * 100).toFixed(1) + '%';
          genauigkeitsVerlauf.push(logs.acc);
          if (fertigeBatches % 5 === 0) zeichneChart();
        },
        onEpochEnd: (epoche, logs) => {
          trainStatus.textContent =
            `Epoche ${epoche + 1}/${epochen} – Testgenauigkeit: ${(logs.val_acc * 100).toFixed(1)} %`;
        },
      },
    });
    balken.style.width = '100%';
    zeichneChart();
    trainStatus.textContent += '  ✅ Training abgeschlossen! Du kannst jetzt Zahlen erkennen lassen.';
    aktiviereErkennung();
  } catch (fehler) {
    trainStatus.textContent = '❌ Fehler beim Training: ' + fehler.message;
  } finally {
    xs.dispose(); ys.dispose(); testXs.dispose(); testYs.dispose();
    btnTraining.disabled = false;
    btnDaten.disabled = datenGeladen;
  }
});

// ---------- Speichern / Laden ----------

btnSpeichern.addEventListener('click', async () => {
  await modell.save(SPEICHER_PFAD);
  trainStatus.textContent = '💾 Modell im Browser gespeichert.';
});

btnLadenBrowser.addEventListener('click', async () => {
  try {
    modell = await tf.loadLayersModel(SPEICHER_PFAD);
    kompiliere(modell);
    trainStatus.textContent = '📂 Gespeichertes Modell geladen – bereit zum Erkennen.';
    aktiviereErkennung();
  } catch {
    trainStatus.textContent = '❌ Kein gespeichertes Modell im Browser gefunden.';
  }
});

btnDownload.addEventListener('click', async () => {
  await modell.save('downloads://ziffern-modell');
});

el('modellDateien').addEventListener('change', async (ereignis) => {
  const dateien = Array.from(ereignis.target.files);
  const json = dateien.find((d) => d.name.endsWith('.json'));
  const gewichte = dateien.filter((d) => d.name.endsWith('.bin'));
  if (!json || gewichte.length === 0) {
    trainStatus.textContent = '❌ Bitte model.json UND die .bin-Datei zusammen auswählen.';
    return;
  }
  try {
    modell = await tf.loadLayersModel(tf.io.browserFiles([json, ...gewichte]));
    kompiliere(modell);
    trainStatus.textContent = '📂 Modell aus Dateien geladen – bereit zum Erkennen.';
    aktiviereErkennung();
  } catch (fehler) {
    trainStatus.textContent = '❌ Modell konnte nicht geladen werden: ' + fehler.message;
  }
});

// ---------- Bildverarbeitung: Ziffern im Bild finden ----------

// Otsu-Schwellenwert auf Grauwerten (0..255)
function otsuSchwelle(histogramm, gesamt) {
  let summe = 0;
  for (let i = 0; i < 256; i++) summe += i * histogramm[i];
  let summeHinten = 0, gewichtVorn = 0, maxVarianz = 0, schwelle = 127;
  for (let t = 0; t < 256; t++) {
    gewichtVorn += histogramm[t];
    if (gewichtVorn === 0) continue;
    const gewichtHinten = gesamt - gewichtVorn;
    if (gewichtHinten === 0) break;
    summeHinten += t * histogramm[t];
    const mittelVorn = summeHinten / gewichtVorn;
    const mittelHinten = (summe - summeHinten) / gewichtHinten;
    const varianz = gewichtVorn * gewichtHinten * (mittelVorn - mittelHinten) ** 2;
    if (varianz > maxVarianz) { maxVarianz = varianz; schwelle = t; }
  }
  return schwelle;
}

// Wandelt ein Bild in eine Binärmaske um: 1 = Tinte (Ziffer), 0 = Hintergrund.
function binarisiere(bildDaten) {
  const { data, width, height } = bildDaten;
  const n = width * height;
  const grau = new Uint8Array(n);
  const histogramm = new Uint32Array(256);
  for (let i = 0; i < n; i++) {
    const g = Math.round(
      0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]);
    grau[i] = g;
    histogramm[g]++;
  }
  const schwelle = otsuSchwelle(histogramm, n);

  let dunkel = 0;
  for (let i = 0; i < n; i++) if (grau[i] <= schwelle) dunkel++;
  // Ziffern sind die Minderheit der Pixel: dunkle Schrift auf hellem
  // Hintergrund oder helle Schrift auf dunklem Hintergrund.
  const tinteIstDunkel = dunkel <= n - dunkel;

  const maske = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    maske[i] = (grau[i] <= schwelle) === tinteIstDunkel ? 1 : 0;
  }
  return maske;
}

// Findet zusammenhängende Tinten-Bereiche (8er-Nachbarschaft) und
// liefert deren Begrenzungsboxen, von links nach rechts sortiert.
function findeZiffernBoxen(maske, width, height) {
  const besucht = new Uint8Array(width * height);
  const boxen = [];
  const stapel = new Int32Array(width * height);

  for (let startIdx = 0; startIdx < width * height; startIdx++) {
    if (!maske[startIdx] || besucht[startIdx]) continue;
    let oben = height, unten = 0, links = width, rechts = 0, flaeche = 0;
    let zeiger = 0;
    stapel[zeiger++] = startIdx;
    besucht[startIdx] = 1;
    while (zeiger > 0) {
      const idx = stapel[--zeiger];
      const x = idx % width, y = (idx / width) | 0;
      flaeche++;
      if (x < links) links = x;
      if (x > rechts) rechts = x;
      if (y < oben) oben = y;
      if (y > unten) unten = y;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const nIdx = ny * width + nx;
          if (maske[nIdx] && !besucht[nIdx]) {
            besucht[nIdx] = 1;
            stapel[zeiger++] = nIdx;
          }
        }
      }
    }
    boxen.push({ x: links, y: oben, w: rechts - links + 1, h: unten - oben + 1, flaeche });
  }

  // Rauschen und Randartefakte aussortieren
  const minFlaeche = Math.max(16, width * height * 0.0003);
  let gefiltert = boxen.filter((b) =>
    b.flaeche >= minFlaeche &&
    b.h >= 5 &&
    !(b.w > width * 0.95 && b.h > height * 0.95));

  // Übereinanderliegende Teile (z. B. abgetrennte Striche) zusammenfassen
  gefiltert.sort((a, b) => a.x - b.x);
  const verschmolzen = [];
  for (const box of gefiltert) {
    const letzte = verschmolzen[verschmolzen.length - 1];
    if (letzte) {
      const ueberlappung =
        Math.min(letzte.x + letzte.w, box.x + box.w) - Math.max(letzte.x, box.x);
      if (ueberlappung > 0.5 * Math.min(letzte.w, box.w)) {
        const x = Math.min(letzte.x, box.x);
        const y = Math.min(letzte.y, box.y);
        letzte.w = Math.max(letzte.x + letzte.w, box.x + box.w) - x;
        letzte.h = Math.max(letzte.y + letzte.h, box.y + box.h) - y;
        letzte.x = x;
        letzte.y = y;
        letzte.flaeche += box.flaeche;
        continue;
      }
    }
    verschmolzen.push({ ...box });
  }
  return verschmolzen;
}

// Bereitet eine Ziffern-Box wie ein MNIST-Bild auf:
// auf 20px skaliert, im 28x28-Feld am Schwerpunkt zentriert.
function boxZu28x28(maske, breite, box) {
  const ausschnitt = document.createElement('canvas');
  ausschnitt.width = box.w;
  ausschnitt.height = box.h;
  const aCtx = ausschnitt.getContext('2d');
  const aBild = aCtx.createImageData(box.w, box.h);
  for (let y = 0; y < box.h; y++) {
    for (let x = 0; x < box.w; x++) {
      const wert = maske[(box.y + y) * breite + (box.x + x)] ? 255 : 0;
      const p = (y * box.w + x) * 4;
      aBild.data[p] = aBild.data[p + 1] = aBild.data[p + 2] = wert;
      aBild.data[p + 3] = 255;
    }
  }
  aCtx.putImageData(aBild, 0, 0);

  const skala = 20 / Math.max(box.w, box.h);
  const zw = Math.max(1, Math.round(box.w * skala));
  const zh = Math.max(1, Math.round(box.h * skala));

  const klein = document.createElement('canvas');
  klein.width = zw;
  klein.height = zh;
  const kCtx = klein.getContext('2d', { willReadFrequently: true });
  kCtx.imageSmoothingEnabled = true;
  kCtx.drawImage(ausschnitt, 0, 0, zw, zh);

  // Schwerpunkt bestimmen, um die Ziffer wie bei MNIST zu zentrieren
  const kPixel = kCtx.getImageData(0, 0, zw, zh).data;
  let masse = 0, mx = 0, my = 0;
  for (let y = 0; y < zh; y++) {
    for (let x = 0; x < zw; x++) {
      const v = kPixel[(y * zw + x) * 4];
      masse += v; mx += x * v; my += y * v;
    }
  }
  const sx = masse ? mx / masse : zw / 2;
  const sy = masse ? my / masse : zh / 2;

  const ziel = document.createElement('canvas');
  ziel.width = 28;
  ziel.height = 28;
  const zCtx = ziel.getContext('2d', { willReadFrequently: true });
  zCtx.fillStyle = '#000';
  zCtx.fillRect(0, 0, 28, 28);
  zCtx.drawImage(klein, Math.round(14 - sx), Math.round(14 - sy));

  const zielPixel = zCtx.getImageData(0, 0, 28, 28).data;
  const eingabe = new Float32Array(BILD_GROESSE);
  for (let i = 0; i < BILD_GROESSE; i++) eingabe[i] = zielPixel[i * 4] / 255;
  return eingabe;
}

// Erkennt alle Ziffern in einem Quell-Canvas und zeigt das Ergebnis an.
async function erkenneZahlen(quellCanvas) {
  if (!modell) return;
  const ctx = quellCanvas.getContext('2d', { willReadFrequently: true });
  const bildDaten = ctx.getImageData(0, 0, quellCanvas.width, quellCanvas.height);
  const maske = binarisiere(bildDaten);
  const boxen = findeZiffernBoxen(maske, quellCanvas.width, quellCanvas.height);

  if (boxen.length === 0) {
    ergebnisAnzeige.textContent = '?';
    detailsAnzeige.textContent = 'Keine Ziffern im Bild gefunden.';
    zeigeAnzeigeCanvas(quellCanvas, []);
    return;
  }

  const eingaben = new Float32Array(boxen.length * BILD_GROESSE);
  boxen.forEach((box, i) => {
    eingaben.set(boxZu28x28(maske, quellCanvas.width, box), i * BILD_GROESSE);
  });

  const vorhersagen = tf.tidy(() => {
    const x = tf.tensor4d(eingaben, [boxen.length, 28, 28, 1]);
    return modell.predict(x);
  });
  const wahrscheinlichkeiten = await vorhersagen.array();
  vorhersagen.dispose();

  const treffer = boxen.map((box, i) => {
    const p = wahrscheinlichkeiten[i];
    const ziffer = p.indexOf(Math.max(...p));
    return { box, ziffer, sicherheit: p[ziffer] };
  });

  ergebnisAnzeige.textContent = treffer.map((t) => t.ziffer).join('');
  detailsAnzeige.textContent = treffer
    .map((t, i) => `Ziffer ${i + 1}: „${t.ziffer}“ (${(t.sicherheit * 100).toFixed(1)} % sicher)`)
    .join('\n');
  zeigeAnzeigeCanvas(quellCanvas, treffer);
}

// Zeigt das analysierte Bild mit grünen Rahmen um jede erkannte Ziffer.
function zeigeAnzeigeCanvas(quellCanvas, treffer) {
  const anzeige = el('anzeigeCanvas');
  anzeige.style.display = 'block';
  anzeige.width = quellCanvas.width;
  anzeige.height = quellCanvas.height;
  const ctx = anzeige.getContext('2d');
  ctx.drawImage(quellCanvas, 0, 0);
  const dicke = Math.max(2, quellCanvas.width / 300);
  ctx.lineWidth = dicke;
  ctx.strokeStyle = '#22c55e';
  ctx.fillStyle = '#22c55e';
  ctx.font = `bold ${Math.max(16, quellCanvas.width / 30)}px sans-serif`;
  for (const { box, ziffer } of treffer) {
    ctx.strokeRect(box.x - dicke, box.y - dicke, box.w + 2 * dicke, box.h + 2 * dicke);
    ctx.fillText(String(ziffer), box.x, Math.max(20, box.y - 6));
  }
}

// ---------- Zeichenfläche ----------

const zeichenflaeche = el('zeichenflaeche');
const zCtx = zeichenflaeche.getContext('2d', { willReadFrequently: true });

function loescheZeichnung() {
  zCtx.fillStyle = '#000';
  zCtx.fillRect(0, 0, zeichenflaeche.width, zeichenflaeche.height);
}
loescheZeichnung();

let zeichnet = false;
function position(ereignis) {
  const rect = zeichenflaeche.getBoundingClientRect();
  const punkt = ereignis.touches ? ereignis.touches[0] : ereignis;
  return {
    x: (punkt.clientX - rect.left) * (zeichenflaeche.width / rect.width),
    y: (punkt.clientY - rect.top) * (zeichenflaeche.height / rect.height),
  };
}
function starteStrich(ereignis) {
  ereignis.preventDefault();
  zeichnet = true;
  const { x, y } = position(ereignis);
  zCtx.strokeStyle = '#fff';
  zCtx.lineWidth = 12;
  zCtx.lineCap = 'round';
  zCtx.lineJoin = 'round';
  zCtx.beginPath();
  zCtx.moveTo(x, y);
}
function ziehe(ereignis) {
  if (!zeichnet) return;
  ereignis.preventDefault();
  const { x, y } = position(ereignis);
  zCtx.lineTo(x, y);
  zCtx.stroke();
}
function endeStrich() { zeichnet = false; }

zeichenflaeche.addEventListener('mousedown', starteStrich);
zeichenflaeche.addEventListener('mousemove', ziehe);
window.addEventListener('mouseup', endeStrich);
zeichenflaeche.addEventListener('touchstart', starteStrich, { passive: false });
zeichenflaeche.addEventListener('touchmove', ziehe, { passive: false });
zeichenflaeche.addEventListener('touchend', endeStrich);

btnLoeschen.addEventListener('click', () => {
  loescheZeichnung();
  ergebnisAnzeige.textContent = '–';
  detailsAnzeige.textContent = '';
  el('anzeigeCanvas').style.display = 'none';
});

btnErkennenZeichnung.addEventListener('click', () => erkenneZahlen(zeichenflaeche));

// ---------- Bild-Upload ----------

bildUpload.addEventListener('change', (ereignis) => {
  const datei = ereignis.target.files[0];
  if (!datei) return;
  const img = new Image();
  img.onload = () => {
    // Sehr große Bilder verkleinern, damit die Analyse schnell bleibt
    const maxSeite = 1200;
    const skala = Math.min(1, maxSeite / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * skala);
    canvas.height = Math.round(img.naturalHeight * skala);
    canvas.getContext('2d', { willReadFrequently: true })
      .drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(img.src);
    erkenneZahlen(canvas);
  };
  img.src = URL.createObjectURL(datei);
});
