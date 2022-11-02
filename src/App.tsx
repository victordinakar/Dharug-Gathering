import { Redirect } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ProvideAuth } from "./hooks/useAuth";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import Menu from "./components/Menu";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Login from "./pages/Login";
import Play from "./pages/Play";
import WordsEdit from "./pages/WordsEdit";
import Edit from "./pages/Edit";
import Words from "./pages/Words";

import { LoginRoute, PrivateRoute } from "./components/Router";

setupIonicReact();

const App: React.FC = () => (
  <ProvideAuth>
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <PrivateRoute path="/" exact={true}>
              <Redirect to="/home" />
            </PrivateRoute>
            <LoginRoute path="/login" exact={true} component={Login} />
            <PrivateRoute
              path="/categories/:category"
              exact={true}
              component={Category}
            />
            <PrivateRoute
              path="/categories"
              exact={true}
              component={Categories}
            />
            
            <PrivateRoute path="/home" exact={true} component={Home} />
            <PrivateRoute path="/words" exact={true} component={Words} />
            <PrivateRoute path="/add" exact={true} component={Edit} />
            <PrivateRoute path="/edit" exact={true} component={WordsEdit} />
            <PrivateRoute path="/edit/:id" exact={true} component={Edit} />
            <PrivateRoute path="/play/:id" exact={true} component={Play} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  </ProvideAuth>
);

export default App;
