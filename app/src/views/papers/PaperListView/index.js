import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';
import APIRequestMethods from '../../../utils/APIRequest';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const PapersListView = () => {
  const classes = useStyles();
  const [papers, setPapers] = useState([]);
  const [displayedPapers, setDisplayedPapers] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const fillDisplayedPapers = () => {
    if (!titleFilter.length) setDisplayedPapers(papers);
    else {
      const newDisplayedPapers = [];

      papers.forEach((paper) => {
        if (paper.name.includes(titleFilter)) {
          newDisplayedPapers.push(paper);
        }
      });

      setDisplayedPapers(newDisplayedPapers);
    }
  };
  const getPapers = () => {
    APIRequestMethods.getPapers()
      .then(({ data }) => {
        if (data.success) {
          setPapers(data.result);
        }
      })
      .catch((error) => {
        console.log(error);
        // TODO
        console.log(titleFilter);
        if (error.response.status === 401) console.log('unauthorized');
      });
  };

  useEffect(() => {
    getPapers();
  }, []);

  useEffect(() => {
    fillDisplayedPapers();
  }, [titleFilter, papers]);

  return (
    <Page
      className={classes.root}
      title="Papers"
    >
      <Container maxWidth={false}>
        <Toolbar setTitleFilter={setTitleFilter} papers={papers} />
        <Box mt={3}>
          <Results papers={displayedPapers} />
        </Box>
      </Container>
    </Page>
  );
};

export default PapersListView;
