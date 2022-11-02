import React from "react";
import { useParams } from "react-router";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonRouterLink,
  IonRow,
  IonText,
} from "@ionic/react";
import { chevronForwardOutline } from "ionicons/icons";
import { useEffect, useState } from "react";

import "./styles.css";
import { words } from "../../api/handler";
import AppContainer from "../../components/AppContainer";

const Category: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [wrds, setWords] = useState<Array<any>>([]);

  useEffect(() => {
    setWords(words);
  }, [words]);

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

  return (
    <AppContainer category={category} search={true} searchFunction={filter}>
      <IonGrid style={{ padding: 0, margin: "-1rem " }}>
        {wrds
          .filter((word) => word.category == category)
          .map((word, key) => (
            <IonRouterLink routerLink={`/play/${word.docId}`} key={key}>
              <IonRow className="word-list" key={key}>
                <IonCol size="9">
                  <IonItem lines="none" key={key}>
                    <IonText>
                      <b>English:</b> <br />
                      {word.english_language}
                    </IonText>
                  </IonItem>
                  <IonItem lines="none">
                    <IonText>
                      <b>Dharug:</b> <br /> {word.dharug_language}
                    </IonText>
                  </IonItem>
                </IonCol>
                <IonCol size="3">
                  <IonItem lines="none">
                    <IonButton fill="clear" slot="end">
                      <IonIcon icon={chevronForwardOutline} />
                    </IonButton>
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonRouterLink>
          ))}
      </IonGrid>
    </AppContainer>
  );
};

export default Category;
