import React from "react";
import { Route } from "react-router-dom";
import HomeLayout from "./HomeLayout";

const RouteLayout = ({ component: Component }) => {
  return (
    <Route
      render={(matchProps) => (
        <HomeLayout>
          <Component {...matchProps} />
        </HomeLayout>
      )}
    />
  );
};

export default RouteLayout;
