import { useEffect } from "react";
import {
  Redirect,
  Route,
  RouteProps,
  useHistory,
  useLocation,
} from "react-router-dom";
import { UserInfo } from "firebase/auth";

import { useAuth } from "../../hooks/useAuth";
import { getUser, setUser } from "../../api/handler";

export const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { user, authInfo } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) => {
        return user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export const LoginRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { user } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const { from } = (location.state as any)?.state || {
    from: { pathname: "/" },
  };

  const assureUserData = async (user: UserInfo) => {
    const { uid, phoneNumber } = user;

    let userData = await getUser(uid);
    console.log("UserData -" + userData);
    console.log("uid -" + uid);
    console.log("phoneNumber -" + phoneNumber);
    userData = {
      phoneNumber,
    };

    await setUser(
      {
        ...userData,
      },
      uid
    ).then((a) => {
      console.log(a);
    });
  };

  useEffect(() => {
    if (user) {
      assureUserData(user);
      history.push(from.pathname);
    }
  }, [user]);

  return <Route {...rest}>{children}</Route>;
};
