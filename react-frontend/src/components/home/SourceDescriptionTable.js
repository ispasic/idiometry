import React from "react";
import { Paragraph, Table } from "evergreen-ui";

const SourceDescriptionTable = (props) => {
  const { result } = props;

  return (
    <>
      <Table>
        <Table.Body>
          <Table.Row height="auto" paddingY={12}>
            <Table.TextCell>Title</Table.TextCell>
            <Table.Cell flexGrow={2}>
              <Paragraph size={300}>
                {result.sourceStatement["Title"]}
              </Paragraph>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.TextCell>Spoken or Written</Table.TextCell>
            <Table.TextCell flexGrow={2}>
              {result.sourceStatement["Spoken or Written"]}
            </Table.TextCell>
          </Table.Row>
          <Table.Row>
            <Table.TextCell>Number of Words</Table.TextCell>
            <Table.TextCell flexGrow={2}>
              {result.sourceStatement["Number of Words"]}
            </Table.TextCell>
          </Table.Row>
          <Table.Row>
            <Table.TextCell>Average Sentence Length</Table.TextCell>
            <Table.TextCell flexGrow={2}>
              {result.sourceStatement["Average Sentence Length"]}
            </Table.TextCell>
          </Table.Row>
        </Table.Body>
      </Table>
      <Table>
        <Table.Head>
          <Table.HeaderCell />
        </Table.Head>
        <Table.Body>
          {Object.entries(result.sourceDescription).map(([key, value]) => (
            <Table.Row height="auto" paddingY={12}>
              <Table.TextCell>{key}</Table.TextCell>
              <Table.TextCell flexGrow={2}>{value}</Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default SourceDescriptionTable;
