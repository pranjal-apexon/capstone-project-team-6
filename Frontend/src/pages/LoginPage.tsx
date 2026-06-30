import React from "react";
import Breadcrumbs from "../components/Layout/Breadcrumbs";
import LoginForm from "../components/Auth/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="page-container">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Login" }]} />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
