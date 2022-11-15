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
import axios from "axios";

const db = getFirestore(app);
const storage = getStorage(app);
const wordsCollectionName = "wordList";

export let words = [];
export let userInfo = {};
export let docId;
export let word = null;
export const setUserInfo = (val) => (userInfo = val);

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

export const setUpDb = async () => {
  return new Promise((resolve, reject) => {
    let count = 230;
    const c = count;
    try {
      data.map(async ({ dharug_audio_path, ...datum }) => {
        const docRef = await addDoc(collection(db, wordsCollectionName), datum);
        let filename = datum.dharug;
        filename = filename.replace(" ", "_").replace("'", "");
        filename = filename + ".mp3";
        if (dharug_audio_path) {
          await fetch(`../assets/${dharug_audio_path}`)
            .then((resp) => resp.blob())
            .then(async (blob) => {
              const fileReader = new FileReader();
              fileReader.readAsArrayBuffer(blob);
              fileReader.onload = async function (e) {
                const file = e.target.result;
                const dharugRef = ref(storage, `audio_data/${filename}`);
                await uploadBytes(dharugRef, file);
                const dharugAudioUrl = await getDownloadURL(dharugRef);

                await updateDoc(docRef, {
                  dharugAudioUrl,
                  docId: docRef.id,
                });
              };
            });
        }

        count += 1;
        console.log(count, c, data.length);
        if (c === count + data.length) {
          resolve("finished");
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const addWord = async (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { dharugAudioFile, dharugAudio, id, ...datum } = payload;
      const docRef = await addDoc(
        collection(db, wordsCollectionName),
        datum,
        id
      );
      docId = docRef.id;
      await updateDoc(docRef, {
        docId: docId,
        id: parseInt(id),
      });
      let filename = datum.dharug;
      filename = filename.replace(" ", "_").replace("'", "");
      filename = filename + ".mp3";
      if (dharugAudioFile) {
        console.log(`audio_data/${filename}`);
        const dharugRef = ref(storage, `audio_data/${filename}`);

        await uploadBytes(dharugRef, dharugAudioFile);
        const dharugAudioUrl = await getDownloadURL(dharugRef);
        await updateDoc(docRef, {
          dharugAudioUrl,
        });
      } else if (dharugAudio) {
        const base64 = dharugAudio.recordDataBase64;
        const url = await convertBase64ToMp3(filename, base64);
        await uploadUrlToFirebase(docRef, filename, url);
        await deleteMp3(filename);
      }
      console.log("work done");
      resolve("Word Created");
    } catch (err) {
      reject(err);
    }
  });
};

export const updateWord = async (payload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { dharugAudio, dharugAudioFile, docId, ...datum } = payload;

      if (docId) {
        const docRef = doc(db, wordsCollectionName, docId);
        await updateDoc(docRef, { ...datum });

        let filename = datum.dharug;
        filename = filename.replace(" ", "_").replace("'", "");
        filename = filename + ".mp3";
        if (dharugAudioFile) {
          const dharugRef = ref(storage, `audio_data/${filename}`);
          await uploadBytes(dharugRef, dharugAudioFile);
          const dharugAudioUrl = await getDownloadURL(dharugRef);
          await updateDoc(docRef, {
            dharugAudioUrl,
          });
        } else if (dharugAudio) {
          const base64 = dharugAudio.recordDataBase64;
          const url = await convertBase64ToMp3(filename, base64);
          await uploadUrlToFirebase(docRef, filename, url);
          await deleteMp3(filename);
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
        const docSnap = await getDoc(docRef);
        const dharugAudioUrl = docSnap.dharugAudioUrl;
        await deleteDoc(docRef);
        resolve("Word Deleted");

        const dharugRef = ref(storage, dharugAudioUrl);
        await deleteObject(dharugRef);
      }
    } catch (err) {}
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

const convertBase64ToMp3 = async (filename, base64) => {
  return new Promise(async (resolve, reject) => {
    try {
      const body = {
        filename: filename,
        base64: base64,
      };
      await axios
        .post("https://computersshiksha.info/m.php", body, {})
        .then((response) => {
          resolve(response.data);
        });
    } catch (err) {
      reject("convertBase64ToMp3" + err);
    }
  });
};
const deleteMp3 = async (filename) => {
  return new Promise(async (resolve, reject) => {
    try {
      const body = {
        filename: filename,
        delete: true,
      };
      await axios
        .post("https://computersshiksha.info/m.php", body, {})
        .then((response) => {
          resolve("finished");
        });
    } catch (err) {
      reject("deleteMp3" + err);
    }
  });
};
export const uploadUrlToFirebase = async (docRef, filename, url) => {
  return new Promise(async (resolve, reject) => {
    try {
      await fetch(url)
        .then((resp) => resp.blob())
        .then(async (blob) => {
          const fileReader = new FileReader();
          fileReader.readAsArrayBuffer(blob);
          fileReader.onload = async function (e) {
            const file = e.target.result;
            console.log(file);
            const dharugRef = ref(storage, `audio_data/${filename}`);
            const metadata = {
              contentType: "audio/mpeg",
            };
            await uploadBytes(dharugRef, file, metadata);
            const dharugAudioUrl = await getDownloadURL(dharugRef);
            console.log(dharugAudioUrl);
            await updateDoc(docRef, {
              dharugAudioUrl,
            });
          };
        });
      resolve("finished");
    } catch (err) {
      reject("uploadUrlToFirebase" + err);
    }
  });
};
