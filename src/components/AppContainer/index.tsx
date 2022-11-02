import React from "react";
import {
  IonButtons,
  IonButton,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonMenuButton,
  IonPage,
  IonRow,
  IonSearchbar,
  IonText,
  IonToolbar,
  IonBackButton,
  IonTitle,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { ReactNode } from "react";
import { useHistory } from "react-router";

import "./styles.css";

interface AppContainerProps {
  children: ReactNode;
  category?: string;
  backButton?: boolean;
  search?: boolean;
  searchFunction?: any;
}

const AppContainer: React.FC<AppContainerProps> = ({
  children,
  category = "",
  backButton = false,
  search = false,
  searchFunction = () => {},
}) => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            {backButton ? (
              <IonBackButton defaultHref="/categories" />
            ) : (
              <IonMenuButton />
            )}
          </IonButtons>
          {search && (
            <IonSearchbar placeholder="Search" onIonChange={searchFunction} />
          )}
          {!search && !backButton && <IonTitle>Dharug Gathering</IonTitle>}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid className="header">
          {category && (
            <IonRow>
              <IonItem lines="none" style={{ padding: ".5rem 0" }}>
                <IonButton
                  fill="clear"
                  slot="start"
                  onClick={() => history.goBack()}
                >
                  <IonIcon icon={arrowBack} />
                </IonButton>
                <IonText>{category}</IonText>
              </IonItem>
            </IonRow>
          )}
        </IonGrid>

        <div className="ion-padding">{children}</div>
      </IonContent>
    </IonPage>
  );
};

export default AppContainer;
