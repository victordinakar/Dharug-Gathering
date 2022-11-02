import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import {
  earthOutline,
  folderOpenOutline,
  logOutOutline,
  addOutline,
  homeOutline,
  pencilOutline,
} from "ionicons/icons";

import { useAuth } from "../../hooks/useAuth";
import "./styles.css";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  show?: boolean;
}

const Menu: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const appPages: AppPage[] = [
    {
      title: "Home",
      url: "/home",
      iosIcon: homeOutline,
      mdIcon: homeOutline,
    },
    {
      title: "Categories",
      url: "/categories",
      iosIcon: folderOpenOutline,
      mdIcon: folderOpenOutline,
    },
    {
      title: "All words",
      url: "/words",
      iosIcon: earthOutline,
      mdIcon: earthOutline,
    },
    {
      title: "Add Word",
      url: "/add",
      iosIcon: addOutline,
      mdIcon: addOutline,
    },
    {
      title: "Edit Word",
      url: "/edit",
      iosIcon: pencilOutline,
      mdIcon: pencilOutline,
    },
  ];

  const getRoute = () => {
    return Boolean(
      location.pathname.includes("login") ||
        location.pathname.includes("register")
    );
  };

  return (
    <IonMenu
      contentId="main"
      type="overlay"
      className="menu"
      disabled={getRoute()}
    >
      <IonContent>
        <IonList>
          <div>
            <IonListHeader className="head">
              Dharug Gathering
              {/* <IonItem>{user?.phoneNumber || ""}</IonItem> */}
            </IonListHeader>
          </div>
          {appPages
            .filter(({ show = true }) => Boolean(show))
            .map(({ show = true, ...appPage }, index) => (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            ))}
          <IonMenuToggle autoHide={false} className="btm">
            <IonItem
              onClick={signOut}
              routerLink={"/"}
              routerDirection="none"
              lines="none"
              detail={false}
            >
              <IonIcon slot="start" icon={logOutOutline} />
              <IonLabel>Logout</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
