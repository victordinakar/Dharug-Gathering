import React from "react";
import { useParams } from "react-router";
import { IonButton, IonGrid, IonIcon } from "@ionic/react";
import { pause, play } from "ionicons/icons";
import { Media } from "@awesome-cordova-plugins/media/index";
import { useEffect, useState } from "react";
import { words } from "../../api/handler";
import AppContainer from "../../components/AppContainer";
import "./styles.css";

const Play: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [word, setWord] = useState<any>({});
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    setWord(words.find((wd) => wd.id == id) || {});
  }, [words, id]);
  const playAudioWithUrl = (filePath: string, playing: string) => {
    const file = Media.create(filePath);
    setPlaying(playing);

    file?.onError.subscribe((ob) => {
      switch (ob) {
        case 1:
          alert("Error: Aborted");
          break;
        case 2:
          alert("Network error");
          break;
        case 3:
          alert("Decode error");
          break;
        case 4:
          alert("Unsupported File");
          break;
        default:
          alert(`An error occurred`);
      }
      setPlaying(null);
    });

    file?.onStatusUpdate.subscribe((ob) => {
      switch (ob) {
        case 0:
          alert("No File");
          break;
        case 1:
          setPlaying(playing);
          break;
        case 2:
          setPlaying(playing);
          break;
        case 3:
          alert("Paused");
          break;
        case 4:
          setPlaying(null);
          break;
        default:
          setPlaying(null);
          break;
      }
    });
    file.play();
  };
  const playAudioWithBase64 = (base64Sound: string, mimeType: string) => {
    const audioRef = new Audio(`data:${mimeType};base64,${base64Sound}`);
    audioRef.oncanplaythrough = () => audioRef.play();
    audioRef.load();
  };
  const playWord = (url: string, audio: any, playing: string) => {
    if (url) {
      playAudioWithUrl(url, playing);
    } else if (audio) {
      playAudioWithBase64(audio?.recordDataBase64, audio?.mimeType);
    }
  };
  return (
    <AppContainer backButton={true}>
      <IonGrid style={{ padding: 0, margin: "-1rem " }}>
        {Boolean(word?.id) && (
          <div>
            <div className="item">
              <p>{word.english}</p>
              {Boolean(word?.englishAudioUrl || word?.englishAudio) && (
                <IonButton
                  color="light"
                  fill="clear"
                  onClick={() =>
                    playWord(word?.englishAudioUrl, word?.englishAudio, "1")
                  }
                >
                  <IonIcon icon={playing == "1" ? pause : play} />
                </IonButton>
              )}
            </div>
            <div className="item">
              <p style={{ fontSize: 24 }}>{word.dharug}</p>
              {Boolean(word?.dharugAudioUrl || word?.dharugAudio) && (
                <IonButton
                  onClick={() =>
                    playWord(word?.dharugAudioUrl, word?.dharugAudio, "2")
                  }
                  fill="clear"
                  slot="end"
                >
                  <IonIcon icon={playing == "2" ? pause : play} />
                </IonButton>
              )}
            </div>
          </div>
        )}
      </IonGrid>
    </AppContainer>
  );
};

export default Play;
