import React, { useState } from "react";
import { Button, Dialog } from "evergreen-ui";
import SourceDescriptionBox from "./SourceDescriptionBox";

const axios = require("axios");
const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const SourceDescriptionButton = (props) => {
  const { file_id } = props;
  const [isShown, setIsShown] = useState(false);
  const [sourceDescriptionLoading, setSourceDescriptionLoading] = useState(
    false
  );
  const [sourceDescriptionResult, setSourceDescriptionResult] = useState({});

  const getSourceResults = async (file_id) => {
    axios
      .get("/api/search_source/", {
        params: {
          file_id: file_id,
        },
        config,
      })
      .then((r) => {
        setSourceDescriptionResult(r.data);
        setSourceDescriptionLoading(false);
      })
      .catch((error) => {
        setSourceDescriptionLoading(false);
        console.error(error);
        return error;
      });
  };

  const handleGetSourceDescriptionButton = async (event) => {
    event.preventDefault();
    setSourceDescriptionLoading(true);
    setIsShown(true);
    await getSourceResults(file_id);
  };

  return (
    <>
      <Dialog
        isShown={isShown}
        title="Source Description"
        hasFooter={false}
        onCloseComplete={() => setIsShown(false)}
      >
        <SourceDescriptionBox
          isLoading={sourceDescriptionLoading}
          result={sourceDescriptionResult}
        />
      </Dialog>
      <Button
        whiteSpace="nowrap"
        minWidth="7em"
        appearance="minimal"
        onClick={(event) => handleGetSourceDescriptionButton(event)}
      >
        {file_id}
      </Button>
    </>
  );
};

export default SourceDescriptionButton;
