import React from "react";
import { Pane, Paragraph, Heading, Link } from "evergreen-ui";

const AboutInfo = () => {
  return (
    <Pane>
      <Heading marginBottom={10}>What is Idiometry?</Heading>
      <Paragraph marginBottom={20}>
        Idiometry is a search engine designed specifically to find potentially
        idiomatic expressions in a large corpus of text documents. This
        installation of Idiometry uses the{" "}
        <Link href="http://www.natcorp.ox.ac.uk/">British National Corpus</Link>
        .
      </Paragraph>
      <Heading marginBottom={10}>How to use Idiometry?</Heading>
      <Paragraph marginBottom={20}>
        The system assumes that a search query is an idiom. It can be given in a
        canonical form (e.g. <em>go out of one's way</em>) or some other
        variation (e.g. <em>went out of her way</em>). Nonetheless, the system
        will process the query in a way that will discover other possible
        variations (e.g. <em>gone completely out of his way</em>). The user does
        not need to search explicitly for such variations. The system will
        expand the query in the background automatically.
      </Paragraph>
      <Heading marginBottom={10}>Which idioms can be searched for?</Heading>
      <Paragraph marginBottom={20}>
        The system provides a selection of almost 3,000 examples that a user can
        use to explore the search functionality, which is by no means limited to
        this list. In other words, a user can search for any other idiom of
        their own choice.
      </Paragraph>
      <Heading marginBottom={10}>Who should use Idiometry?</Heading>
      <Paragraph marginBottom={20}>
        Anyone interested in studying idioms can use Idiometry. We hope it will
        be useful tool to teachers and learners of English, linguists and
        natural language processing specialists.
      </Paragraph>
      <Heading marginBottom={10}>
        Where can I learn more about Idiometry?
      </Heading>
      <Paragraph marginBottom={20}>
        Idiometry is described in detail in the following publication:
      </Paragraph>
      <Paragraph marginBottom={20}>
        Callum Hughes, Maxim Filimonov, Alison Wray, Irena Spasić (2021) Leaving
        no stone unturned: Flexible retrieval of idiomatic expressions from a
        large text corpus. Machine Learning and Knowledge Extraction, Vol. 3,
        No. 1, pp. 263-283
      </Paragraph>
      <Paragraph marginBottom={20}>
        Please use this reference to cite Idiometry.
      </Paragraph>
    </Pane>
  );
};

export default AboutInfo;
