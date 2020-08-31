import React, { useState } from "react";
import MySpinner from "../home/MySpinner";
const axios = require("axios");
const config = {
  headers: {
    "Content-Type": "application/json"
  }
};

const ResultsPage = props => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { query } = props.match.params;
  axios
    .get("/api/search_sentences/", {
      params: {
        q: query,
        s: 10000
      },
      config
    })
    .then(r => {
      setResults(r.data.results_list);
      setIsLoading(false);
    })
    .catch(error => {
      console.error(error);
      return error;
    });

  return (
    <>
      {isLoading ? (
        <MySpinner />
      ) : (
        <>
          {results?.map(result => (
            <div>
              <code>{result.sentence}</code>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default ResultsPage;
