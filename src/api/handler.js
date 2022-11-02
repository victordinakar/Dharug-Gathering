import app from "./config";
import data from "../data.json";
import {
  collection,
  addDoc,
  getFirestore,
  updateDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const db = getFirestore(app);
const storage = getStorage(app);
const wordsCollectionName = "vWords";

export let words = [];
export let userInfo = {};
export let docId;
export const setUserInfo = (val) => (userInfo = val);

export const setUpDb = async () => {
  return new Promise((resolve, reject) => {
    let count = 0;
    try {
      data.map(async ({ english_audio_path, dharug_audio_path, ...datum }) => {
        const docRef = await addDoc(collection(db, wordsCollectionName), datum);

        if (english_audio_path) {
          await fetch(`../assets/${english_audio_path}`)
            .then((resp) => resp.blob())
            .then(async (blob) => {
              const fileReader = new FileReader();
              fileReader.readAsArrayBuffer(blob);
              fileReader.onload = async function (e) {
                const file = e.target.result;
                const englishRef = ref(
                  storage,
                  `audios/${docRef.id}/english.mp3`
                );
                const englishTask = await uploadBytes(englishRef, file);
                const englishAudioUrl = await getDownloadURL(englishRef);

                await updateDoc(docRef, {
                  englishAudioUrl,
                  docId: docRef.id,
                });
              };
            });
        }

        if (dharug_audio_path) {
          await fetch(`../assets/${dharug_audio_path}`)
            .then((resp) => resp.blob())
            .then(async (blob) => {
              const fileReader = new FileReader();
              fileReader.readAsArrayBuffer(blob);
              fileReader.onload = async function (e) {
                const file = e.target.result;
                const dharugRef = ref(
                  storage,
                  `audios/${docRef.id}/dharug.mp3`
                );
                const dharugTask = await uploadBytes(dharugRef, file);
                const dharugAudioUrl = await getDownloadURL(dharugRef);

                await updateDoc(docRef, {
                  dharugAudioUrl,
                  docId: docRef.id,
                });
              };
            });
        }

        count += 1;
        console.log(count, data.length);
        if (count === data.length) {
          resolve("finished");
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const getWords = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = collection(db, wordsCollectionName);
      const docSnap = await getDocs(docRef);
      words = docSnap.docs.map((doc) => doc.data());
      resolve(words);
    } catch (err) {
      reject(err);
    }
  });
};

export const getUser = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, "vUsers", userId);
      const docSnap = await getDoc(docRef);
      const user = docSnap.data();
      resolve(user);
    } catch (err) {
      reject(err);
    }
  });
};

export const setUser = async (payload, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await setDoc(doc(db, "vUsers", userId), { ...payload, userId });
      resolve({ ...payload, userId });
    } catch (err) {
      reject(err);
    }
  });
};

export const addWord = async (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { englishAudioFile, dharugAudioFile, id, ...datum } = payload;
      const docRef = await addDoc(collection(db, wordsCollectionName), datum);
      docId = docRef.id;
      await updateDoc(docRef, {
        docId: docId,
        id: parseInt(id),
      });
      if (englishAudioFile) {
        const englishRef = ref(storage, `audios/${docId}/english.mp3`);
        const englishTask = await uploadBytes(englishRef, englishAudioFile);
        const englishAudioUrl = await getDownloadURL(englishRef);
        await updateDoc(docRef, {
          englishAudioUrl,
        });
      }

      if (dharugAudioFile) {
        const dharugRef = ref(storage, `audios/${docId}/dharug.mp3`);
        const dharugTask = await uploadBytes(dharugRef, dharugAudioFile);
        const dharugAudioUrl = await getDownloadURL(dharugRef);
        await updateDoc(docRef, {
          dharugAudioUrl,
        });
      }

      resolve("Word Created");
    } catch (err) {
      reject(err);
    }
  });
};

export const updateWord = async (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { englishAudioFile, dharugAudioFile, docId, ...datum } = payload;

      if (docId) {
        await updateDoc(doc(db, wordsCollectionName, docId), { ...datum });

        if (englishAudioFile) {
          const englishRef = ref(storage, `audios/${docId}/english.mp3`);
          const englishTask = await uploadBytes(englishRef, englishAudioFile);
          const englishAudioUrl = await getDownloadURL(englishRef);
          await updateDoc(doc(db, wordsCollectionName, docId), {
            englishAudioUrl,
          });
        }

        if (dharugAudioFile) {
          const dharugRef = ref(storage, `audios/${docId}/dharug.mp3`);
          const dharugTask = await uploadBytes(dharugRef, dharugAudioFile);
          const dharugAudioUrl = await getDownloadURL(dharugRef);
          await updateDoc(doc(db, wordsCollectionName, docId), {
            dharugAudioUrl,
          });
        }
      }
      resolve("finished");
    } catch (err) {
      reject(err);
    }
  });
};

export const deleteWord = async (docId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (docId) {
        const docRef = doc(db, wordsCollectionName, docId);
        await deleteDoc(docRef);
        resolve("Word Deleted");

        const englishRef = ref(storage, `audios/${docId}/english.mp3`);
        const dharugRef = ref(storage, `audios/${docId}/dharug.mp3`);
        await deleteObject(englishRef);
        await deleteObject(dharugRef);
      }
    } catch (err) {}
  });
};
export let word = null;

export const getWordWithDocId = async (docId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, wordsCollectionName, docId);

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        word = docSnap.data();
        console.log(word);
      } else {
        console.log("No such document!");
      }
      resolve(word);
    } catch (err) {
      reject(err);
    }
  });
};
