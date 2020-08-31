import React from "react";
import { Text, Pane } from "evergreen-ui";
import { Link } from "react-router-dom";

const BreadCrumbs = () => {
  return (
    <Pane display="flex" marginTop={5} marginBottom={20}>
      <Link to={"/"} style={{ alignSelf: "center", marginRight: "5px" }}>
        <Text>Home</Text>
      </Link>
      <Text marginRight={5}>></Text>
      <Text>About</Text>
    </Pane>
  );
};

export default BreadCrumbs;
