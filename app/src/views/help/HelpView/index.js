import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark
  }
}));

const HelpView = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Help"
    >
      <Card style={{ padding: '20px', margin: '20px' }}>
        <CardContent>
          <Typography variant="h1" component="div" gutterBottom>
            Welcome in Ardent!
          </Typography>
          <Typography variant="body1">
            Ardent (for
            {' '}
            <i>ARchitecture knowleDge ExtractioN plaTform</i>
            ), is a platform
            designed to support the extraction of software architectures from academic literature.
            From that, this application can leverage several algorithms to compute
            similarities between architectures and identify new or existing software patterns.
          </Typography>
          <br />
          <Typography variant="body1">
            <b>Tutorial -</b>
            {' '}
            The dashboard menu proposes several features. First, in the
            {' '}
            <i>Study papers </i>
            tab, you can input papers, architectures, and components.
            To input papers, you can do it manually by providing BibTeX information, but also
            use an auto-importer from
            {' '}
            <a href="https://parsif.al">Parsif.al</a>
            {' '}
            export results.
            Thus, this tool can be use in complement of Parsif.al.
            You can monitor the submission of papers and architectures using the
            {' '}
            <i>Dashboard</i>
            .
          </Typography>
          <br />
          <Typography variant="body1">
            After the completion of the extraction, you can use the
            {' '}
            <i>Analytics</i>
            {' '}
            menu to
            identify the patterns, by using provided algorithm. You can tune the algorithm to
            be more or less sensitive on discovered patterns.
            In
            {' '}
            <i>Analytics</i>
            , you will also find a menu to see base components, their occurences
            in extracted architectures, and references to instances.
          </Typography>
        </CardContent>
      </Card>
    </Page>
  );
};

export default HelpView;
