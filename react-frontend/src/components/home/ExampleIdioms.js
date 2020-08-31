import React, { useState } from "react";
import { Pane, Dialog, Button } from "evergreen-ui";
import ExampleIdiomsDialog from "./ExampleIdiomsDialog";
import { Link } from "react-router-dom";

const ExampleIdioms = (props) => {
  const { setQueryState } = props;
  const [isShown, setIsShown] = useState(false);
  return (
    <Pane display="flex" justifyContent="space-between" marginTop={10}>
      <Dialog
        isShown={isShown}
        title="Example Idioms"
        hasFooter={false}
        onCloseComplete={() => setIsShown(false)}
      >
        <ExampleIdiomsDialog {...{ setQueryState, setIsShown }} />
      </Dialog>

      <Button appearance="minimal" onClick={() => setIsShown(true)}>
        Show example idioms
      </Button>
      <Link
        to={"about"}
        style={{ textDecoration: "none", alignSelf: "center" }}
      >
        <Button height={32} appearance="minimal" iconAfter="help">
          About
        </Button>
      </Link>
    </Pane>
  );
};

export default ExampleIdioms;
