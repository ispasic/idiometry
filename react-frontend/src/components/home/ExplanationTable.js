import React from "react";
import { Paragraph, Table } from "evergreen-ui";

const ExplanationTable = (props) => {
  const { result } = props;

  return (
    <>
      <Table>
        <Table.Body>
          <Table.Row height="auto" paddingY={12}>
            <Table.TextCell>Sentence</Table.TextCell>
            <Table.Cell flexGrow={2}>
              <Paragraph size={300}>{result.sentence}</Paragraph>
            </Table.Cell>
          </Table.Row>
          <Table.Row height="auto" paddingY={12}>
            <Table.TextCell>Highlight</Table.TextCell>
            <Table.Cell flexGrow={2}>
              <Paragraph size={300}>{result.highlight}</Paragraph>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.TextCell>Score Total</Table.TextCell>
            <Table.TextCell flexGrow={2}>{result.score?.value}</Table.TextCell>
          </Table.Row>
        </Table.Body>
      </Table>
      <Table>
        <Table.Head>
          <Table.TextHeaderCell>Value</Table.TextHeaderCell>
          <Table.TextHeaderCell flexGrow={2}>Description</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {result.score?.sum_of?.map((detail) => (
            <Table.Row height="auto" paddingY={12}>
              <Table.TextCell>{detail.value}</Table.TextCell>
              <Table.Cell flexGrow={2}>
                <Paragraph size={300}>{detail.description}</Paragraph>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default ExplanationTable;
