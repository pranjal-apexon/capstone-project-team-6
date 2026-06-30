import React from "react";
import Breadcrumbs from "../components/Layout/Breadcrumbs";
import RegisterForm from "../components/Auth/RegisterForm";

const RegisterPage: React.FC = () => {
  return (
    <div className="page-container">
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Register" }]}
      />
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
