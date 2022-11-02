import React, { useEffect, useState } from "react";
import {
  IonCol,
  IonIcon,
  IonRow,
  IonText,
  IonRouterLink,
  useIonAlert,
  IonLoading,
} from "@ionic/react";
import { earth } from "ionicons/icons";
import { useHistory } from "react-router";

import { words, getWords } from "../../api/handler";
import "./styles.css";
import AppContainer from "../../components/AppContainer";
const Admin: React.FC = () => {
  const [wrds, setWords] = useState<Array<any>>([]);
  const history = useHistory();
  const [showLoading, setShowLoading] = useState(true);
  const [present] = useIonAlert();

  const init = async () => {
    setShowLoading(true);
    try {
      const res = await getWords();
      setWords(res);
    } catch {
      present({
        header: `Error`,
        message: `An error occurred while updating list, please try again`,
        buttons: ["OK"],
      });
    } finally {
      setShowLoading(false);
    }
  };

  const filter = (e: any) => {
    const searchVal = String(e.detail.value).toLowerCase();
    if (searchVal) {
      const res = wrds.filter(
        (w) =>
          String(w.english_language).toLowerCase().indexOf(searchVal) > -1 ||
          String(w.dharug_language).toLowerCase().indexOf(searchVal) > -1 ||
          String(w.category).toLowerCase().indexOf(searchVal) > -1
      );
      setWords(res);
    } else {
      setWords(words);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setWords(words);
  }, [words]);

  return (
    <AppContainer searchFunction={filter} search={true}>
      {wrds.map((word, key) => (
        <IonRow key={key} className="admin">
          <IonCol size="1.5">
            <IonIcon className="color-green" icon={earth} />
          </IonCol>
          <IonCol size="10.5">
            <IonRouterLink routerLink={`/play/${word.docId}`}>
              <IonText>
                <p>
                  <b>English: </b>
                  {word.english_language}
                </p>
                <p>
                  <b>Dharug: </b>
                  {word.dharug_language}
                </p>
                <p>
                  <b>Category: </b>
                  {word.category}
                </p>
              </IonText>
            </IonRouterLink>
          </IonCol>
        </IonRow>
      ))}
      {showLoading && (
        <IonLoading isOpen={showLoading} message={"Updating List..."} />
      )}
    </AppContainer>
  );
};

export default Admin;
