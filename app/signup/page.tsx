import React from "react";
import AuthShell from "../components/AuthShell";

const SignupPage = () => {
  return (
    <AuthShell
      mode="signup"
      heading="Create your account"
      subheading="One tap, and your first deck is a minute away."
    />
  );
};

export default SignupPage;