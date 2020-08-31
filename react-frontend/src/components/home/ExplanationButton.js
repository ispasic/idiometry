import React, { useState } from "react";
import { Button, Dialog } from "evergreen-ui";
import ExplanationBox from "./ExplanationBox";

const axios = require("axios");
const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

const ExplanationButton = (props) => {
  const { file_id, searchScore, sentQuery } = props;
  const [isShown, setIsShown] = useState(false);
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [explanationResult, setExplanationResult] = useState({});

  const getExplanationResults = async (file_id) => {
    axios
      .get("/api/search_explanation/", {
        params: {
          file_id: file_id,
          search_idiom: sentQuery,
        },
        config,
      })
      .then((r) => {
        setExplanationResult(r.data);
        setExplanationLoading(false);
      })
      .catch((error) => {
        setExplanationLoading(false);
        console.error(error);
        return error;
      });
  };

  const handleGetExplanationButton = async (event) => {
    event.preventDefault();
    setExplanationLoading(true);
    setIsShown(true);
    await getExplanationResults(file_id);
  };

  return (
    <>
      <Dialog
        isShown={isShown}
        title="Score Explanation"
        hasFooter={false}
        onCloseComplete={() => setIsShown(false)}
      >
        <ExplanationBox
          isLoading={explanationLoading}
          result={explanationResult}
        />
      </Dialog>
      <Button
        whiteSpace="nowrap"
        minWidth="7em"
        appearance="minimal"
        onClick={(event) => handleGetExplanationButton(event)}
      >
        {Number.parseFloat(searchScore).toPrecision(6)}
      </Button>
    </>
  );
};

export default ExplanationButton;
