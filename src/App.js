import "./App.css";
import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import {
  unstable_HistoryRouter as HistoryRouter,
  Route,
  Routes,
  Navigate,
  NavLink,
} from "react-router-dom";
import LoginPage from "./components/loginPage";
import RegisterPage from "./components/RegisterPage";
import HomePage from "./components/HomePage";
import MyPosts from "./components/MyPosts";
import ProfilePage from "./components/Profile";
import ErrorPage from "./components/ErrorPage";
import { createBrowserHistory } from "history";
export const history = createBrowserHistory();

function App() {
  return (
    <Provider store={store}>
      <HistoryRouter history={history}>
          <div className="nav-div">
            <nav className="navbar">
              <ul className="nav-list">
                <li>
                  <NavLink to="/home" activeClassName="active-link" className="nav-link">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/myposts" activeClassName="active-link" className="nav-link">
                    My posts
                  </NavLink>
                </li>
                { "" ? (
                  <>
                    <li>
                      <NavLink to="/auth/login" activeClassName="active-link" className="nav-link">
                        Login
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/auth/register" activeClassName="active-link" className="nav-link">
                        Register
                      </NavLink>
                    </li>
                  </>
                ) : null}
                <li>
                  <NavLink to="/myprofile" activeClassName="active-link" className="nav-link">
                    My Profile
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
          <div className="body-div">
            <Routes>
              <Route path="/" element={<Navigate replace to="/auth/login" />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/myposts" element={<MyPosts />} />
              <Route path="/myprofile" element={<ProfilePage />} />
              <Route path="/timeout" element={<ErrorPage />} />
            </Routes>
        </div>
      </HistoryRouter>
    </Provider>
  );
}

export default App;
