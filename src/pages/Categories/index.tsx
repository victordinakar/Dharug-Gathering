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
import { words, getWords } from "../../api/handler";
import AppContainer from "../../components/AppContainer";
import "./styles.css";

const Categories: React.FC = () => {
  const [wrds, setWords] = useState<Array<any>>([]);
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
    <AppContainer search={true} searchFunction={filter}>
      <IonRow>
        {[...new Set(wrds.map((word) => word.category))].map(
          (category, key) =>
            category && (
              <IonCol size="4" className="custom" key={key}>
                <IonRouterLink routerLink={`/categories/${category}`}>
                  <IonIcon icon={earth} />
                  <IonText>{category}</IonText>
                </IonRouterLink>
              </IonCol>
            )
        )}
      </IonRow>
      {showLoading && (
        <IonLoading isOpen={showLoading} message={"Updating List..."} />
      )}
    </AppContainer>
  );
};

export default Categories;
