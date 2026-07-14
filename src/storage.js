// ---------------------------------------------------------------
// Persistence layer
// - App state (checklists, weight, measurements, streaks, etc.) -> localStorage
// - Progress photos (can be large) -> IndexedDB
// - Export/Import -> single JSON file the user can back up manually
// ---------------------------------------------------------------

const STATE_KEY = "reto30-state-v1";
const DB_NAME = "reto30-db";
const DB_VERSION = 1;
const PHOTO_STORE = "photos";

/* ---------------- localStorage (app state) ---------------- */

export function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("No se pudo leer el progreso guardado", e);
    return null;
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error("No se pudo guardar el progreso", e);
    return false;
  }
}

/* ---------------- IndexedDB (progress photos) ---------------- */

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(PHOTO_STORE)) {
        db.createObjectStore(PHOTO_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function savePhoto({ id, day, date, dataUrl }) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, "readwrite");
    tx.objectStore(PHOTO_STORE).put({ id, day, date, dataUrl });
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllPhotos() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, "readonly");
    const req = tx.objectStore(PHOTO_STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deletePhoto(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, "readwrite");
    tx.objectStore(PHOTO_STORE).delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

/* ---------------- Backup / Restore ---------------- */

export async function exportBackup(state) {
  const photos = await getAllPhotos();
  const backup = {
    exportedAt: new Date().toISOString(),
    app: "reto-30-dias",
    version: 1,
    state,
    photos,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `reto30-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function importBackup(file) {
  const text = await file.text();
  const backup = JSON.parse(text);
  if (!backup || !backup.state) throw new Error("Archivo de respaldo inválido");
  saveState(backup.state);
  if (Array.isArray(backup.photos)) {
    for (const p of backup.photos) {
      await savePhoto(p);
    }
  }
  return backup.state;
}
