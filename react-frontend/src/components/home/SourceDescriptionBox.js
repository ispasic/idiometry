import React from "react";
import { Pane } from "evergreen-ui";
import MySpinner from "./MySpinner";
import SourceDescriptionTable from "./SourceDescriptionTable";

const SourceDescriptionBox = (props) => {
  const { isLoading, result } = props;

  return (
    <Pane width="100%">
      {isLoading ? <MySpinner /> : <SourceDescriptionTable result={result} />}
    </Pane>
  );
};

export default SourceDescriptionBox;
