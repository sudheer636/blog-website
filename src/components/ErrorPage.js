import React from "react";
import { history } from "../App";
import './ErrorPage.css';

function ErrorPage() {
  const redirectToLoginPage = () => {
    history.push("/auth/login");
  };

  return (
    <div className="errorpage-container">
      <h1>404 timed out (Token expired), Please login again</h1>
      <button className="errorpage-button" onClick={redirectToLoginPage}>Login</button>
    </div>
  );
}

export default ErrorPage;
