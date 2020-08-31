import React from "react";
import { Pane, Heading } from "evergreen-ui";
import Logo from "./Logo";

const Header = () => {
  return (
    <Pane borderBottom display="flex" alignItems="center">
      <Logo />
      <Heading marginLeft={3} marginTop={15} marginBottom={15} size={900}>
        Idiometry: An idiom search engine
      </Heading>
    </Pane>
  );
};

export default Header;
