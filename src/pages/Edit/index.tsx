import React, { useRef } from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  useIonAlert,
} from "@ionic/react";
import { useEffect, useState } from "react";
import {
  words,
  updateWord,
  addWord,
  deleteWord,
  getWords,
} from "../../api/handler";
import { micOutline, stopOutline, play, pause } from "ionicons/icons";
import "./styles.css";
import AppContainer from "../../components/AppContainer";
import {
  VoiceRecorder,
  RecordingData,
  GenericResponse,
} from "capacitor-voice-recorder";

const Edit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [present] = useIonAlert();
  const history = useHistory();
  const [errors, setErrors] = useState<any>({});
  const [processing, setProcessing] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<boolean>(false);
  const defaultWord = {
    category: "",
    dharugAudioFile: "",
    dharug_language: "",
    englishAudioFile: "",
    english_language: "",
    id: words.length + 1 || "",
  };

  const [word, setWord] = useState<any>({});
  const [micStatus, setMicStatus] = useState<string | null>(null);

  const handleUpload = async () => {
    setErrors({});
    if (!word.id) return setErrors({ id: "Id is required" });
    if (!word.english_language)
      return setErrors({ english_language: "English language is required" });
    if (!word.dharug_language)
      return setErrors({ dharug_language: "Dharug language is required" });
    if (!word.category) return setErrors({ category: "Category is required" });
    if (id && !word.docId)
      return setErrors({ message: "No document ID provided" });

    try {
      setProcessing(true);
      const res = id ? await updateWord(word) : await addWord(word);
      await getWords();
      present({
        header: `${id ? "Update" : "Upload"} Success`,
        message: `Word has been successfully ${id ? "Updated" : "Uploaded"}`,
        buttons: ["OK"],
      });
      history.push("/admin");
    } catch (err: any) {
      setErrors({ message: err?.message || "An error occurred" });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = () => {
    present({
      header: "Delete Word?",
      message: "kindly confirm that you would like to delete this word?",
      buttons: [
        "Cancel",
        {
          text: "Ok",
          handler: async (d) => {
            try {
              setDeleting(true);
              await deleteWord(id);
              await getWords();
              present({
                header: `Delete Success`,
                message: `Word has been successfully deleted`,
                buttons: ["OK"],
              });
              history.push("/admin");
            } catch (err) {
              alert("Error deleting");
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    });
  };

  useEffect(() => {
    if (id) {
      setWord(words.find((wd) => wd.docId == id) || {});
    } else {
      setWord(defaultWord);
    }
  }, [words, id]);

  VoiceRecorder.requestAudioRecordingPermission().then(
    (result: GenericResponse) => {
      console.log("requestAudioRecordingPermission " + result.value);
    }
  );
  VoiceRecorder.canDeviceVoiceRecord().then((result: GenericResponse) => {
    console.log("canDeviceVoiceRecord" + result.value);
  });

  const record = async (lang: string) => {
    if (!VoiceRecorder.hasAudioRecordingPermission())
      VoiceRecorder.requestAudioRecordingPermission();
    let l = "d";
    if (lang == "englishAudio") l = "e";
    if (micStatus == null) {
      await VoiceRecorder.startRecording()
        .then((result: GenericResponse) =>
          console.log("recording started " + result.value)
        )
        .catch((error) => console.log(error));

      setMicStatus(l + "playing");
    } else if (micStatus == l + "playing") {
      VoiceRecorder.pauseRecording();
      setMicStatus(l + "paused");
    } else if (micStatus == l + "paused") {
      VoiceRecorder.resumeRecording();
      setMicStatus(l + "playing");
    }
  };
  const stop = (lang: string) => {
    VoiceRecorder.stopRecording()
      .then((result: RecordingData) => {
        const base64Sound = result.value.recordDataBase64; // from plugin
        const mimeType = result.value.mimeType; // from plugin
        const audioRef = new Audio(`data:${mimeType};base64,${base64Sound}`);
        audioRef.oncanplaythrough = () => audioRef.play();
        audioRef.load();
        if (lang == "dharugAudio") {
          setWord({
            ...word,
            dharugAudio: result.value,
          });
        } else if (lang == "englishAudio") {
          setWord({
            ...word,
            englishAudio: result.value,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setMicStatus(null);
  };
  return (
    <AppContainer backButton={true}>
      <IonGrid className="edit">
        {
          <>
            <h3>{id ? "Edit" : "Add"} Word</h3>
            <p className="info">Create an account to access application</p>

            {/* <IonLabel position="stacked">ID</IonLabel>
            <IonInput
              name="id"
              placeholder="Enter id"
              readonly={true}
              onIonChange={(e) => setWord({ ...word, id: e.detail.value })}
              value={word.id}
            /> */}
            {errors?.id && <small>{errors?.id || ""}</small>}

            <IonLabel position="stacked">English Language</IonLabel>
            <IonTextarea
              name="english_language"
              placeholder="Enter english language"
              onIonChange={(e) =>
                setWord({ ...word, english_language: e.detail.value })
              }
              value={word.english_language}
            />
            {errors?.english_language && (
              <small>{errors?.english_language || ""}</small>
            )}

            <IonLabel position="stacked">Dharug Language</IonLabel>
            <IonTextarea
              name="dharug_language"
              placeholder="Enter dharug language"
              onIonChange={(e) =>
                setWord({ ...word, dharug_language: e.detail.value })
              }
              value={word.dharug_language}
            />
            {errors?.dharug_language && (
              <small>{errors?.dharug_language || ""}</small>
            )}

            <IonLabel position="stacked">Category</IonLabel>
            {newCategory ? (
              <IonInput
                name="category"
                placeholder="Enter new category"
                onIonChange={(e) =>
                  setWord({ ...word, category: e.detail.value })
                }
                value={word.category}
              />
            ) : (
              <IonSelect
                name="category"
                placeholder="Enter category"
                onIonChange={(e) =>
                  setWord({ ...word, category: e.detail.value })
                }
                value={word.category}
              >
                {[...new Set(words.map((word) => word.category))].map(
                  (category, key) => (
                    <IonSelectOption key={key} value={category}>
                      {category}
                    </IonSelectOption>
                  )
                )}
              </IonSelect>
            )}
            <small
              onClick={() => setNewCategory(!newCategory)}
              style={{
                margin: "-0.2rem 0 .5rem",
                display: "block",
              }}
            >
              {newCategory ? "Use existing categories" : "Add new category"}
            </small>
            {errors?.category && <small>{errors?.category || ""}</small>}

            <IonLabel position="stacked">English Audio</IonLabel>
            <input
              name="englishAudioFile"
              type="file"
              accept="audio/*"
              onChange={(e) => {
                var files: any = e?.target?.files;
                if (Boolean(files[0])) {
                  setWord({
                    ...word,
                    englishAudioFile: files[0],
                  });
                } else {
                  setWord({
                    ...word,
                    englishAudioFile: "",
                  });
                }
              }}
            />
            {errors?.id && <small>{errors?.id || ""}</small>}
            <IonRow>
              <IonCol>
                <IonItem onClick={() => record("englishAudio")}>
                  <IonIcon
                    icon={
                      (Boolean(micStatus == "epaused") && play) ||
                      (Boolean(micStatus == "eplaying") && pause) ||
                      micOutline
                    }
                  />
                  <IonLabel>Record</IonLabel>
                </IonItem>
              </IonCol>
              <IonCol>
                <IonItem onClick={() => stop("englishAudio")}>
                  <IonIcon icon={stopOutline}></IonIcon>
                  <IonLabel>Stop Recording</IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonLabel position="stacked">Dharug Audio</IonLabel>
            <input
              name="dharugAudioFile"
              type="file"
              accept="audio/*"
              onChange={(e) => {
                var files: any = e?.target?.files;
                if (Boolean(files[0])) {
                  setWord({
                    ...word,
                    dharugAudioFile: files[0],
                  });
                } else {
                  setWord({
                    ...word,
                    dharugAudioFile: "",
                  });
                }
              }}
            />
            {errors?.dharugAudioFile && (
              <small>{errors?.dharugAudioFile || ""}</small>
            )}
            <IonRow>
              <IonCol>
                <IonItem onClick={() => record("dharugAudio")}>
                  <IonIcon
                    icon={
                      (Boolean(micStatus == "dpaused") && play) ||
                      (Boolean(micStatus == "dplaying") && pause) ||
                      micOutline
                    }
                  />
                  <IonLabel>Record</IonLabel>
                </IonItem>
              </IonCol>
              <IonCol>
                <IonItem onClick={() => stop("dharugAudio")}>
                  <IonIcon icon={stopOutline}></IonIcon>
                  <IonLabel>Stop Recording</IonLabel>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonButton
              onClick={() => handleUpload()}
              disabled={processing || deleting}
            >
              {processing ? (
                id ? (
                  "Updating..."
                ) : (
                  "Adding..."
                )
              ) : (
                <>{id ? "Update" : "Add"}</>
              )}
            </IonButton>

            {errors?.message && (
              <small style={{ textAlign: "center", display: "block" }}>
                {errors?.message || ""}
              </small>
            )}

            {Boolean(id) && (
              <IonButton
                fill="clear"
                className="delete-btn"
                disabled={deleting || processing}
                style={{ marginTop: "2rem" }}
                onClick={() => handleDelete()}
              >
                {deleting ? "Deleting..." : "Delete word"}
              </IonButton>
            )}
          </>
        }
      </IonGrid>
    </AppContainer>
  );
};

export default Edit;
