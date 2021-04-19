import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  makeStyles,
  Card,
  CardContent,
  Typography,
  Button
} from '@material-ui/core';
import {
  deleteArchitecture as deleteArchitectureRequest,
  saveNewArchitecture as saveNewArchitectureRequest,
  saveExistingArchitecture as saveExistingArchitectureRequest
} from 'src/requests/architectures';
import {
  saveNewPaper as saveNewPaperRequest,
  saveExistingPaper as saveExistingPaperRequest,
  deletePaper as deletePaperRequest,
  getPapers as getPapersRequest,
} from 'src/requests/papers';
import { getUsers as getUsersRequest } from 'src/requests/users';
import authenticationService from 'src/requests/authentication';
import LoadingOverlay from 'src/components/LoadingOverlay';
import Page from 'src/components/Page';
import MessageSnackbar from 'src/components/MessageSnackbar';
import handleErrorRequest from 'src/utils/handleErrorRequest';
import Results from './Results';
import Toolbar from './Toolbar';
import PaperModal from './PaperModal';
import ArchitectureModal from './ArchitectureModal';
import BibtexModal from './BibtexModal';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  buttonMargin: {
    marginRight: theme.spacing(1),
  }
}));

const PapersListView = () => {
  const navigate = useNavigate();
  const classes = useStyles();
  const [papers, setPapers] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [displayedPapers, setDisplayedPapers] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [open, setOpen] = useState(false);

  const [bibtexModalOpen, setBibtexModalOpen] = useState(false);

  const [paperModalProps, setPaperModalProps] = useState({
    open: false,
    paper: {},
    users: [],
    currentUser: {},
    actionType: ''
  });

  const [architectureModalProps, setArchitectureModalProps] = useState({
    open: false,
    architecture: {},
    actionType: ''
  });

  const [messageSnackbarProps, setMessageSnackbarProps] = useState({
    open: false,
    message: '',
    duration: 0,
    severity: 'information'
  });

  const displayMsg = (message, severity = 'success', duration = 6000) => {
    setMessageSnackbarProps({
      open: true,
      severity,
      duration,
      message
    });
  };

  const removePaperFromState = (paperId) => {
    let i;
    const newPapers = [...papers];
    for (i = 0; i < newPapers.length; i++) {
      if (newPapers[i].id === paperId) {
        newPapers.splice(i, 1);
        setPapers(newPapers);
        return true;
      }
    }

    return false;
  };

  const removeArchitectureFromState = (paperId, architectureId) => {
    let i; let j;
    const newPapers = [...papers];
    for (i = 0; i < newPapers.length; i++) {
      if (newPapers[i].id === paperId) {
        for (j = 0; j < newPapers[i].architectures.length; j++) {
          if (newPapers[i].architectures[j].id === architectureId) {
            newPapers[i].architectures.splice(j, 1);
            setPapers(newPapers);
            return true;
          }
        }
      }
    }

    return false;
  };

  const modifyPaperFromState = (newPaper) => {
    let i;
    const newPapers = [...papers];
    for (i = 0; i < newPapers.length; i++) {
      if (newPapers[i].id === newPaper.id) {
        newPapers[i] = newPaper;
        setPapers(newPapers);
        return true;
      }
    }

    return false;
  };

  const addArchitectureToState = (newArchitecture) => {
    let i;
    const newPapers = [...papers];
    for (i = 0; i < newPapers.length; i++) {
      if (newPapers[i].id === newArchitecture.paper_id) {
        newPapers[i].architectures.push(newArchitecture);
        setPapers(newPapers);
        return true;
      }
    }

    return false;
  };

  const modifyArchitectureFromState = (newArchitecture) => {
    let i; let j;
    const newPapers = [...papers];
    for (i = 0; i < newPapers.length; i++) {
      if (newPapers[i].id === newArchitecture.paper_id) {
        for (j = 0; j < newPapers[i].architectures.length; j++) {
          if (newPapers[i].architectures[j].id === newArchitecture.id) {
            newPapers[i].architectures[j] = newArchitecture;
            setPapers(newPapers);
            return true;
          }
        }
      }
    }

    return false;
  };

  const deletePaper = (paperId) => {
    setOpen(true);
    deletePaperRequest(paperId)
      .then((data) => {
        if (data.success) {
          removePaperFromState(paperId);
          if (paperModalProps.open) {
            setPaperModalProps({
              ...paperModalProps,
              open: false,
              paper: {},
              actionType: ''
            });
          }
          displayMsg('Paper successfully deleted.');
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg))
      .finally(() => { setOpen(false); });
  };

  const deleteArchitecture = (paperId, architectureId) => {
    setOpen(true);
    deleteArchitectureRequest(architectureId)
      .then((data) => {
        if (data.success) {
          removeArchitectureFromState(paperId, architectureId);
          if (setArchitectureModalProps.open) {
            setArchitectureModalProps({
              open: false,
              architecture: {},
              actionType: ''
            });
          }
          displayMsg('Architecture successfully deleted.');
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg))
      .finally(() => { setOpen(false); });
  };

  const saveNewPaper = async (newPaper, handleAdditionHere = true) => {
    setOpen(true);
    try {
      const data = await saveNewPaperRequest(newPaper);
      setOpen(false);
      if (data.success) {
        if (handleAdditionHere) {
          setPapers([
            ...papers,
            {
              ...newPaper,
              id: data.paperId,
              status: 0,
              architectures: []
            }
          ]);
          setPaperModalProps({
            ...paperModalProps,
            open: false,
            paper: {},
            actionType: ''
          });
          displayMsg('Paper successfully added.');
        } else {
          return {
            ...newPaper,
            id: data.paperId,
            status: 0,
            architectures: []
          };
        }
      }
    } catch (error) {
      if (handleAdditionHere) handleErrorRequest(error, displayMsg);
    }

    setOpen(false);
    return {};
  };

  const saveNewArchitecture = (newArchitecture) => {
    setOpen(true);
    saveNewArchitectureRequest(newArchitecture)
      .then((data) => {
        if (data.success) {
          addArchitectureToState({ ...newArchitecture, id: data.architectureId });
          setArchitectureModalProps({
            open: false,
            architecture: {},
            actionType: ''
          });
          displayMsg('Architecture successfully added.');
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg))
      .finally(() => { setOpen(false); });
  };

  const saveExistingPaper = (newPaper) => {
    setOpen(true);
    saveExistingPaperRequest(newPaper)
      .then((data) => {
        if (data.success) {
          modifyPaperFromState(newPaper);
          setPaperModalProps({
            ...paperModalProps,
            open: false,
            paper: {},
            actionType: ''
          });
          displayMsg('Paper successfully modified.');
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg))
      .finally(() => { setOpen(false); });
  };

  const saveExistingArchitecture = (newArchitecture) => {
    setOpen(true);
    saveExistingArchitectureRequest(newArchitecture)
      .then((data) => {
        if (data.success) {
          modifyArchitectureFromState(newArchitecture);
          setArchitectureModalProps({
            open: false,
            architecture: {},
            actionType: ''
          });
          displayMsg('Architecture successfully modified.');
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg))
      .finally(() => { setOpen(false); });
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

  const paperActionHandler = (actionType, paper) => {
    switch (actionType) {
      case 'new':
        setPaperModalProps({
          ...paperModalProps,
          open: true,
          actionType,
          paper: {}
        });
        break;
      case 'edit':
      case 'view':
        if (paper) {
          setPaperModalProps({
            ...paperModalProps,
            open: true,
            actionType,
            paper
          });
        }
        break;

      case 'delete':
        // Can be replaced with a prettier modal later.
        if (window.confirm('Paper deletion is irreversible. Associated architectures, components, and properties will also be deleted. Proceed?')) deletePaper(paper.id);
        break;

      default:
        console.error('No action were provided to the handler.');
    }
  };

  const toolbarActionHandler = (source) => {
    switch (source) {
      case 'paper':
        paperActionHandler('new');
        break;

      case 'bibtex':
        setBibtexModalOpen(true);
        break;

      case 'parsifal':
        console.log('parsifal');
        break;

      default:
        console.error('No action were provided for this source.');
    }
  };

  const architectureActionHandler = (actionType, architecture) => {
    switch (actionType) {
      case 'new':
        setArchitectureModalProps({
          open: true,
          actionType,
          architecture: { paper_id: architecture.paper_id }
        });
        break;
      case 'edit':
      case 'view':
        setArchitectureModalProps({
          open: true,
          actionType,
          architecture
        });
        break;

      case 'delete':
        // Can be replaced with a prettier modal later.
        if (window.confirm('Architecture deletion is irreversible. Associated components and properties will also be deleted. Proceed?')) deleteArchitecture(architecture.paper_id, architecture.id);
        break;

      default:
        console.error('No action were provided to the handler.');
    }
  };

  const paperActionModalHandler = (actionType, newPaper) => {
    switch (actionType) {
      case 'delete':
        if (window.confirm('Paper deletion is irreversible. Associated architectures, components, and properties will also be deleted. Proceed?')) deletePaper(paperModalProps.paper.id);
        break;

      case 'new':
        saveNewPaper({
          ...newPaper,
          added_by: currentUser.username
        });
        break;

      case 'edit':
        saveExistingPaper(newPaper);
        break;

      default:
        console.error('No action were provided to the handler.');
    }
  };

  const architectureActionModalHandler = (actionType, newArchitecture) => {
    switch (actionType) {
      case 'delete':
        if (window.confirm('Architecture deletion is irreversible. Associated components and properties will also be deleted. Proceed?')) { deleteArchitecture(architectureModalProps.architecture.paper_id, architectureModalProps.architecture.id); }
        break;

      case 'new':
        saveNewArchitecture(newArchitecture);
        break;

      case 'edit':
        saveExistingArchitecture(newArchitecture);
        break;

      default:
        console.error('No action were provided to the handler.');
    }
  };

  const architectureClickHandler = (architectureId) => {
    navigate(`/app/architecture/${architectureId}`);
  };

  const getPapers = async () => {
    try {
      const data = await getPapersRequest();
      if (data.success) {
        setPapers(data.result);
      }
    } catch (error) {
      handleErrorRequest(error, displayMsg);
    }
  };

  const saveHandler = async (newPapers) => {
    const requests = [];
    for (let i = 0; i < newPapers.length; i++) {
      requests.push(saveNewPaper({
        ...newPapers[i],
        added_by: currentUser.username,
        updated_by: currentUser.username
      }, false));
    }

    let results = await Promise.all(requests);
    results = results.filter((result) => JSON.stringify(result) !== '{}');
    const paperDiff = newPapers.length - results.length;
    setPapers([...papers, ...results]);
    setBibtexModalOpen(false);
    if (!paperDiff) {
      if (results.length) {
        displayMsg(`${results.length} paper${results.length > 1 ? 's' : ''} successfully added from the BibTeX file.`, 'success', 6000);
      } else {
        displayMsg('No paper were found in the BibTeX file or found papers already exist.', 'info', 6000);
      }
    } else if (results.length) {
      displayMsg(`${results.length} paper${results.length > 1 ? 's' : ''} were successfully added from the BibTeX file, but ${paperDiff} paper${paperDiff > 1 ? 's' : ''} were not added due to an unknown problem.`, 'warning', 6000);
    } else {
      displayMsg(`No paper were added, but ${paperDiff} paper${paperDiff > 1 ? 's' : ''} were not added due to an unknown problem.`, 'error', 6000);
    }
  };

  const getUsersProps = async () => {
    try {
      const data = await getUsersRequest();
      if (data.success) {
        const authInfo = authenticationService.currentUserValue;
        if (authInfo && authInfo.user) {
          setPaperModalProps({
            ...paperModalProps,
            currentUser: authInfo.user,
            users: data.result
          });
          setCurrentUser(authInfo.user);
          setUsers(data.result);
        }
      }
    } catch (error) {
      handleErrorRequest(error, displayMsg);
    }
  };

  useEffect(() => {
    setOpen(true);
    Promise.all([getPapers(), getUsersProps()])
      .then(() => {
        setOpen(false);
      });
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
        {
        displayedPapers.length
          ? (
            <Box>
              <Toolbar
                setTitleFilter={setTitleFilter}
                actionHandler={toolbarActionHandler}
                papers={papers}
              />
              <Box mt={3}>
                {displayedPapers.length && (
                <Results
                  papers={displayedPapers}
                  paperActionHandler={paperActionHandler}
                  architectureActionHandler={architectureActionHandler}
                  architectureClickHandler={architectureClickHandler}
                  users={users}
                />
                )}
              </Box>
            </Box>
          )
          : (
            <Box mt={3} align="center">
              <Card>
                <CardContent>
                  <Typography variant="h1" component="div" gutterBottom>
                    No paper yet.
                  </Typography>
                  <Typography variant="body1">
                    <p>
                      You can add a new paper by clicking the button below.
                    </p>
                  </Typography>
                  <Box
                    mt={3}
                  >
                    <Button
                      className={classes.buttonMargin}
                      color="primary"
                      variant="contained"
                      onClick={() => paperActionHandler('new', null)}
                    >
                      Add paper
                    </Button>
                    <Button>
                      Import papers from Parsif.al
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )
      }
        <BibtexModal
          open={bibtexModalOpen}
          setOpen={setBibtexModalOpen}
          saveHandler={saveHandler}
        />
        <PaperModal
          modalProps={paperModalProps}
          setModalProps={setPaperModalProps}
          actionModalHandler={paperActionModalHandler}
        />
        <ArchitectureModal
          modalProps={architectureModalProps}
          setModalProps={setArchitectureModalProps}
          actionModalHandler={architectureActionModalHandler}
        />
        <MessageSnackbar
          messageSnackbarProps={messageSnackbarProps}
          setMessageSnackbarProps={setMessageSnackbarProps}
        />
        <LoadingOverlay open={open} />
      </Container>
    </Page>
  );
};

export default PapersListView;
