import React from "react";
import { Pane } from "evergreen-ui";
import MySpinner from "./MySpinner";
import ExplanationTable from "./ExplanationTable";

const ExplanationBox = (props) => {
  const { isLoading, result } = props;

  return (
    <Pane width="100%">
      {isLoading ? <MySpinner /> : <ExplanationTable {...{ result }} />}
    </Pane>
  );
};

export default ExplanationBox;
