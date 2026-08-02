import React from "react";
import AuthShell from "../components/AuthShell";

const LoginPage = () => {
  return (
    <AuthShell
      mode="login"
      heading="Welcome back"
      subheading="Sign in to pick up where you left off."
    />
  );
};

export default LoginPage;