// src/db.js
import { openDB } from 'idb';

const DB_NAME = 'MediaDB';
const STORE_NAME = 'mediaItems';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function addMediaItem(item) {
  const db = await initDB();
  return db.add(STORE_NAME, item);
}

export async function getAllMediaItems() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function removeMediaItem(id) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}
