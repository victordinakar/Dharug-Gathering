import React from "react";
import firebase from "firebase/compat/app";
import { Props as ReactFirebaseUIProps } from "react-firebaseui";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import "firebase/compat/auth";
import { IonContent, IonPage, IonTitle } from "@ionic/react";

import "./styles.css";

const uiConfig: ReactFirebaseUIProps["uiConfig"] = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      defaultCountry: "AU",
    },
  ],
};

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="login-container">
          <IonTitle color="light" size="large">
            Dharug Gathering App
          </IonTitle>
          <br />
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
