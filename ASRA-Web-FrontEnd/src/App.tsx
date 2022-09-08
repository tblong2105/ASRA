import "./App.css";
import "./assets/styles/index.scss";
import "./assets/styles/common.scss";
import "./assets/styles/icons.scss";
import "./assets/styles/custom.scss";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  AuthRouter,
  UserRouter,
  InnkeeperRouter,
  AdminRouter,
} from "./components/Permission";
import {
  guestRoutes,
  userRoutes,
  authRoutes,
  innkeeperRoutes,
  adminRoutes,
} from "./router";
import { handleGetInfoRoute } from "./helpers/router-helper";
import { Router } from "./models/Router";
import { initLocalStorage } from "./commons/utils/localstorage-utils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store";
import { dataSearch } from "./store/feature/search/searchSlice";
import { ROLE_ADMIN } from "commons/constants/Role";
import NotFound from "./views/errors/404-page";

function App() {
  let RouteInfo: Router;
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const userInfor = JSON.parse(localStorage.getItem("userInfor") || "{}");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location?.pathname]);

  useEffect(() => {
    if (location.pathname.split("/")[1] != "search") {
      dispatch(dataSearch(""));
    }
  }, [location?.pathname]);

  useEffect(() => {
    initLocalStorage();
  }, []);

  return (
    <div className="App">
      <Routes>
        {/* Any role can be request */}
        {authRoutes.map((route, index) => {
          RouteInfo = handleGetInfoRoute(route);
          return (
            <Route
              key={index}
              path={RouteInfo.path}
              element={
                <RouteInfo.Layout>
                  <AuthRouter>
                    <RouteInfo.Page />
                  </AuthRouter>
                </RouteInfo.Layout>
              }
            />
          );
        })}
        {userInfor?.roles?.includes(ROLE_ADMIN) ? (
          adminRoutes.map((route, index) => {
            RouteInfo = handleGetInfoRoute(route);
            return (
              <Route
                key={index}
                path={RouteInfo.path}
                element={
                  <RouteInfo.Layout>
                    <AdminRouter>
                      <RouteInfo.Page />
                    </AdminRouter>
                  </RouteInfo.Layout>
                }
              />
            );
          })
        ) : (
          <>
            {guestRoutes.map((route, index) => {
              RouteInfo = handleGetInfoRoute(route);
              return (
                <Route
                  key={index}
                  path={RouteInfo.path}
                  element={
                    <RouteInfo.Layout>
                      <RouteInfo.Page />
                    </RouteInfo.Layout>
                  }
                />
              );
            })}
            {userRoutes.map((route, index) => {
              RouteInfo = handleGetInfoRoute(route);
              return (
                <Route
                  key={index}
                  path={RouteInfo.path}
                  element={
                    <RouteInfo.Layout>
                      <UserRouter>
                        <RouteInfo.Page />
                      </UserRouter>
                    </RouteInfo.Layout>
                  }
                />
              );
            })}
            {innkeeperRoutes.map((route, index) => {
              RouteInfo = handleGetInfoRoute(route);
              return (
                <Route
                  key={index}
                  path={RouteInfo.path}
                  element={
                    <RouteInfo.Layout>
                      <InnkeeperRouter>
                        <RouteInfo.Page />
                      </InnkeeperRouter>
                    </RouteInfo.Layout>
                  }
                />
              );
            })}
          </>
        )}
        {/* No other routes match */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
