import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
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
  saveExistingArchitecture as saveExistingArchitectureRequest,
  cloneArchitecture as cloneArchitectureRequest,
  getArchitectureGraph as getArchitectureGraphRequest
} from 'src/requests/architectures';
import {
  saveNewPaper as saveNewPaperRequest,
  saveExistingPaper as saveExistingPaperRequest,
  deletePaper as deletePaperRequest,
} from 'src/requests/papers';
import {
  getProjectPapers as getProjectPapersRequest
} from 'src/requests/projects';
import { getUsers as getUsersRequest } from 'src/requests/users';
import { saveQuestion as saveQuestionRequest } from 'src/requests/questions';
import authenticationService from 'src/requests/authentication';
import LoadingOverlay from 'src/components/LoadingOverlay';
import DotOverlay from 'src/components/DotOverlay';
import Page from 'src/components/Page';
import PaperModal from 'src/modals/PaperModal';
import ArchitectureModal from 'src/modals/ArchitectureModal';
import CloneModal from 'src/modals/CloneModal';
import BibtexModal from 'src/modals/BibtexModal';
import ConfirmModal from 'src/modals/ConfirmModal';
import QuestionModal from 'src/modals/QuestionModal';
import Results from './Results';
import Toolbar from './Toolbar';
import { useProject } from '../../../project-context';

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
  const { enqueueSnackbar } = useSnackbar();
  const [papers, setPapers] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [displayedPapers, setDisplayedPapers] = useState([]);
  const [stateSelect, setStateSelect] = useState(-1);
  const [titleFilter, setTitleFilter] = useState({
    name: '',
    id: ''
  });

  const {
    state: { project },
  } = useProject();

  const [open, setOpen] = useState(false);
  const [dotProps, setDotProps] = useState({
    open: false,
    graph: ''
  });
  const [bibtexModalOpen, setBibtexModalOpen] = useState(false);
  const [questionModalProps, setQuestionModalProps] = useState({
    open: false,
    context: {}
  });
  const [confirmModalProps, setConfirmModalProps] = useState({
    open: false,
    actionModalHandler: null,
    message: ''
  });
  const [paperModalProps, setPaperModalProps] = useState({
    open: false,
    paper: { status: 0 },
    users: [],
    actionType: ''
  });

  const [architectureModalProps, setArchitectureModalProps] = useState({
    open: false,
    architecture: {},
    actionType: ''
  });

  const [cloneModalProps, setCloneModalProps] = useState({
    open: false,
    architecture: {},
    papers: [],
    actionType: ''
  });

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
              paper: { status: 0 },
              actionType: ''
            });
          }
          enqueueSnackbar('Paper successfully deleted.', { variant: 'success' });
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), 'error'))
      .finally(() => { setOpen(false); });
  };

  const deleteArchitecture = (paperId, architectureId) => {
    setOpen(true);
    deleteArchitectureRequest(architectureId)
      .then((data) => {
        if (data.success) {
          removeArchitectureFromState(paperId, architectureId);
          if (architectureModalProps.open) {
            setArchitectureModalProps({
              open: false,
              architecture: {},
              actionType: ''
            });
          }
          enqueueSnackbar('Architecture successfully deleted.', { variant: 'success' });
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), 'error'))
      .finally(() => { setOpen(false); });
  };

  const saveNewPaper = async (newPaper, handleAdditionHere = true) => {
    setOpen(true);
    try {
      const data = await saveNewPaperRequest({ ...newPaper, project_url: project.url });
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
            paper: { status: 0 },
            actionType: ''
          });
          enqueueSnackbar('Paper successfully added.', { variant: 'success' });
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
      if (handleAdditionHere) enqueueSnackbar(error, 'error');
    }

    setOpen(false);
    return {};
  };

  const saveNewArchitecture = (newArchitecture) => {
    setOpen(true);
    saveNewArchitectureRequest({ ...newArchitecture, project_url: project.url })
      .then((data) => {
        if (data.success) {
          addArchitectureToState({ ...newArchitecture, id: data.architectureId });
          setArchitectureModalProps({
            open: false,
            architecture: {},
            actionType: ''
          });
          enqueueSnackbar('Architecture successfully added.', { variant: 'success' });
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), 'error'))
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
            paper: { status: 0 },
            actionType: ''
          });
          enqueueSnackbar('Paper successfully modified.', { variant: 'success' });
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), 'error'))
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
          enqueueSnackbar('Architecture successfully modified.', { variant: 'success' });
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), 'error'))
      .finally(() => { setOpen(false); });
  };

  const fillDisplayedPapers = () => {
    const filterPapers = (paper) => {
      if (!paper.name.includes(titleFilter.name) && titleFilter.name.length) return false;
      if (paper.status !== stateSelect && stateSelect !== -1) return false;
      return true;
    };

    const newDisplayedPapers = papers.filter(filterPapers);
    setDisplayedPapers(newDisplayedPapers);
  };

  const paperActionHandler = (actionType, paper) => {
    switch (actionType) {
      case 'new':
        setPaperModalProps({
          ...paperModalProps,
          open: true,
          actionType,
          paper: { added_by: currentUser.username, status: 0 }
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
        setConfirmModalProps({
          ...confirmModalProps,
          open: true,
          message: 'Paper deletion is irreversible. Associated architectures, components, and properties will also be deleted. Proceed?',
          actionModalHandler: () => deletePaper(paper.id)
        });
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

      case 'question':
        setQuestionModalProps({
          ...questionModalProps,
          open: true,
          context: {}
        });
        break;

      case 'parsifal':
        console.log('Parsif.al import not implemented yet.');
        break;

      default:
        console.error('No action were provided for this source.');
    }
  };

  const getArchitectureGraph = (architecture) => {
    setOpen(true);
    getArchitectureGraphRequest(architecture.id)
      .then((data) => {
        if (data.success) {
          setDotProps({
            open: true,
            graph: data.result
          });
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), 'error'))
      .finally(() => { setOpen(false); });
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
      case 'clone':
        setCloneModalProps({
          open: true,
          architecture,
          papers
        });
        break;
      case 'graph':
        getArchitectureGraph(architecture);
        break;
      case 'question':
        setQuestionModalProps({
          ...questionModalProps,
          open: true,
          context: {}
        });
        break;
      case 'delete':
        setConfirmModalProps({
          ...confirmModalProps,
          open: true,
          message: 'Architecture deletion is irreversible. Associated components and properties will also be deleted. Proceed?',
          actionModalHandler: () => deleteArchitecture(
            architecture.paper_id,
            architecture.id
          )
        });
        break;

      default:
        console.error('No action were provided to the handler.');
    }
  };

  const paperActionModalHandler = (actionType, newPaper) => {
    switch (actionType) {
      case 'delete':
        setConfirmModalProps({
          ...confirmModalProps,
          open: true,
          message: 'Paper deletion is irreversible. Associated architectures, components, and properties will also be deleted. Proceed?',
          actionModalHandler: () => deletePaper(paperModalProps.paper.id)
        });
        break;

      case 'new':
        saveNewPaper(newPaper);
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
        setConfirmModalProps({
          ...confirmModalProps,
          open: true,
          message: 'Architecture deletion is irreversible. Associated components and properties will also be deleted. Proceed?',
          actionModalHandler: () => deleteArchitecture(
            architectureModalProps.architecture.paper_id,
            architectureModalProps.architecture.id
          )
        });
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
    navigate(`/project/${project.url}/architecture/${architectureId}`);
  };

  const getPapers = async () => {
    if (project.url) {
      try {
        const data = await getProjectPapersRequest(project.url);
        if (data.success) {
          setPapers(data.result);
        }
      } catch (error) {
        enqueueSnackbar(error, 'error');
      }
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
        enqueueSnackbar(`${results.length} paper${results.length > 1 ? 's' : ''} successfully added from the BibTeX file.`, { variant: 'success' });
      } else {
        enqueueSnackbar('No paper were found in the BibTeX file or found papers already exist.', { variant: 'info' });
      }
    } else if (results.length) {
      enqueueSnackbar(
        `${results.length} paper${results.length > 1 ? 's' : ''} were successfully added from the BibTeX file, but ${paperDiff} paper${paperDiff > 1 ? 's' : ''} were not added due to an unknown problem.`,
        { variant: 'warning' }
      );
    } else {
      enqueueSnackbar(
        `No paper were added, but ${paperDiff} paper${paperDiff > 1 ? 's' : ''} were not added due to an unknown problem.`,
        { variant: 'error' }
      );
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
      enqueueSnackbar(error, 'error');
    }
  };

  const postQuestion = (question) => {
    saveQuestionRequest({ ...question, project_url: project.url })
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Question successfully post. You can find it in the Questions section.', { variant: 'success' });
          setQuestionModalProps({
            ...questionModalProps,
            open: false
          });
        } else {
          enqueueSnackbar('Failed to post a question. Verify that you are still connected by refreshing the page.', { variant: 'error' });
        }
      })
      .catch(() => {
        enqueueSnackbar('Failed to post a question. Verify that you are still connected by refreshing the page.', { variant: 'error' });
      });
  };

  const handleClone = async ({ architecture, paper }) => {
    setOpen(true);
    cloneArchitectureRequest(architecture.id, paper.id)
      .then((data) => {
        if (data.success) {
          setCloneModalProps({
            open: false,
            architecture: {},
            papers: [],
            actionType: ''
          });
          addArchitectureToState({ ...architecture, id: data.architectureId, paper_id: paper.id });
          enqueueSnackbar('Architecture successfully added.', { variant: 'success' });
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), 'error'))
      .finally(() => { setOpen(false); });
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
  }, [titleFilter, papers, stateSelect]);

  return (
    <Page
      className={classes.root}
      title="Papers"
    >
      <Container maxWidth={false}>
        {
        papers.length
          ? (
            <Box>
              <Toolbar
                setTitleFilter={setTitleFilter}
                stateSelect={stateSelect}
                setStateSelect={setStateSelect}
                actionHandler={toolbarActionHandler}
                papers={papers}
              />
              <Box mt={3}>
                {displayedPapers.length ? (
                  <Results
                    papers={displayedPapers}
                    paperActionHandler={paperActionHandler}
                    architectureActionHandler={architectureActionHandler}
                    architectureClickHandler={architectureClickHandler}
                    users={users}
                  />
                ) : (
                  <Box mt={3} align="center">
                    <Card>
                      <CardContent>
                        <Typography variant="h1" component="div" gutterBottom>
                          No paper found for this query.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
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
        <ConfirmModal
          modalProps={confirmModalProps}
          setModalProps={setConfirmModalProps}
        />
        <CloneModal
          modalProps={cloneModalProps}
          setModalProps={setCloneModalProps}
          actionModalHandler={handleClone}
        />
        <QuestionModal
          modalProps={questionModalProps}
          setModalProps={setQuestionModalProps}
          actionModalHandler={postQuestion}
        />
        <LoadingOverlay open={open} />
        <DotOverlay
          open={dotProps.open}
          graph={dotProps.graph}
          setOpen={(newOpen) => setDotProps({ ...dotProps, open: newOpen })}
        />
      </Container>
    </Page>
  );
};

export default PapersListView;
