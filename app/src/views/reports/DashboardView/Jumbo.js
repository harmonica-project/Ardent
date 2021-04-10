import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  makeStyles,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    padding: '20px'
  }
}));

const Jumbo = ({ className }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Typography variant="h1" component="div" gutterBottom>
          Welcome to Ardent!
        </Typography>
        <Typography variant="body1">
          <p>
            Ardent (for
            {' '}
            <i>ARchitecture knowleDge ExtractioN plaTform</i>
            ), is a platform
            designed to support the extraction of software architectures from academic literature.
            From that, this application can leverage several algorithms to compute
            similarities between architectures and identify new or existing software patterns.
          </p>
        </Typography>
        <br />
        <Typography variant="body1">
          <p>
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
          </p>
        </Typography>
        <br />
        <Typography variant="body1">
          <p>
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
          </p>
        </Typography>
      </CardContent>
    </Card>
  );
};

Jumbo.propTypes = {
  className: PropTypes.string
};

export default Jumbo;
