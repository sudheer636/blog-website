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
// import PostModal from "./components/PostModal"
import { createBrowserHistory } from "history";
export const history = createBrowserHistory();

function App() {
  return (
    <Provider store={store}>
      <HistoryRouter history={history}>
        <div>
          <div className="nav-div">
          <nav className="navbar">
            <ul className="nav-list">
              <li>
                <NavLink to="/home" activeClassName="active-link">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/myposts" activeClassName="active-link">
                  My posts
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" activeClassName="active-link">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" activeClassName="active-link">
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink to="/myprofile" activeClassName="active-link">
                  My Profile
                </NavLink>
              </li>
            </ul>
          </nav>
          </div>
          <div className="body-div">
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/register" element={<RegisterPage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/home" element={<HomePage />}></Route>
            <Route path="/myposts" element={<MyPosts />}></Route>
            <Route path="/myprofile" element={<ProfilePage />}></Route>
            {/* <Route path="/postmodal" element={<PostModal />}></Route> */}
          </Routes>
          </div>
        </div>
      </HistoryRouter>
    </Provider>
  );
}

export default App;
