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
import PaperModal from './PaperModal';

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
  const [modalProps, setModalProps] = useState({
    open: false,
    paper: {},
    actionType: ''
  });

  const removePaperFromState = (paperId) => {
    let i;
    const newPapers = [...papers];
    for (i = 0; i < papers.length; i++) {
      if (papers[i].id === paperId) {
        newPapers.splice(i, 1);
        setPapers(newPapers);
        return true;
      }
    }

    return false;
  };

  const deletePaper = (paperId) => {
    APIRequestMethods.deletePaper(paperId)
      .then(({ data }) => {
        if (data.success) {
          removePaperFromState(paperId);
          if (modalProps.open) {
            setModalProps({
              open: false,
              paper: {},
              actionType: ''
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
        // TODO
        console.log(titleFilter);
        if (error.response.status === 401) console.log('unauthorized');
      });
  };

  const saveNewPaper = (newPaper) => {
    APIRequestMethods.saveNewPaper(newPaper)
      .then(({ data }) => {
        if (data.success) {
          setPapers([
            ...papers,
            {
              ...newPaper,
              id: data.paperId,
              status: 0,
              architectures: []
            }
          ]);
          setModalProps({
            open: false,
            paper: {},
            actionType: ''
          });
        }
      })
      .catch((error) => {
        console.log(error);
        // TODO
        console.log(titleFilter);
        if (error.response.status === 401) console.log('unauthorized');
      });
  };

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

  const findPaper = (paperId) => {
    let i;
    for (i = 0; i < papers.length; i++) {
      if (papers[i].id === paperId) return papers[i];
    }

    return false;
  };

  const actionHandler = (actionType, paperId) => {
    let paper;
    if (paperId) paper = findPaper(paperId);

    switch (actionType) {
      case 'new':
        setModalProps({
          open: true,
          actionType,
          paper: {}
        });
        break;
      case 'edit':
      case 'view':
        if (paper) {
          setModalProps({
            open: true,
            actionType,
            paper
          });
        }
        break;

      case 'delete':
        // Can be replaced with a prettier modal later.
        if (window.confirm('Paper deletion is irreversible. Associated architectures, components, and properties will also be deleted. Proceed?')) deletePaper(paperId);
        break;

      default:
        console.error('No action were provided to the handler.');
    }
  };

  const actionModalHandler = (actionType, newPaper) => {
    switch (actionType) {
      case 'delete':
        if (window.confirm('Paper deletion is irreversible. Associated architectures, components, and properties will also be deleted. Proceed?')) deletePaper(modalProps.paper.id);
        break;

      case 'new':
        saveNewPaper({
          ...newPaper,
          added_by: localStorage.getItem('username')
        });
        break;

      case 'edit':
        console.log('Not implemented yet.');
        break;

      default:
        console.error('No action were provided to the handler.');
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
        <Toolbar setTitleFilter={setTitleFilter} actionHandler={actionHandler} papers={papers} />
        <Box mt={3}>
          <Results papers={displayedPapers} actionHandler={actionHandler} />
        </Box>
      </Container>
      <PaperModal
        modalProps={modalProps}
        setModalProps={setModalProps}
        actionModalHandler={actionModalHandler}
      />
    </Page>
  );
};

export default PapersListView;
