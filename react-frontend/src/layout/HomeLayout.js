import React from "react";
import Header from "../components/common/Header";

const HomeLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="body">{children}</div>
    </div>
  );
};

export default HomeLayout;
