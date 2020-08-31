import React from "react";
import { Pane } from "evergreen-ui";
import BreadCrumbs from "./BreadCrumbs";
import AboutInfo from "./AboutInfo";

const AboutPage = () => {
  return (
    <Pane>
      <BreadCrumbs />
      <AboutInfo />
    </Pane>
  );
};

export default AboutPage;
