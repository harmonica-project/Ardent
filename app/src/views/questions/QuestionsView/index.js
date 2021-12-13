import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  InputAdornment,
  makeStyles,
  Input,
  IconButton,
  Button,
  Card,
  Grid,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  Typography,
  FormControl,
  Divider,
  FormGroup,
  FormControlLabel,
  Switch
} from '@material-ui/core';
import {
  Send as SendIcon,
  HighlightOff as HighlightOffIcon
} from '@material-ui/icons/';
import {
  getProjectQuestions as getProjectQuestionsRequest,
} from 'src/requests/projects';
import {
  markAsClosed as markAsClosedRequest
} from 'src/requests/questions';
import { NavLink } from 'react-router-dom';
import {
  getAnswers as getAnswersRequest,
  saveAnswer as saveAnswerRequest,
  deleteAnswer as deleteAnswerRequest
} from 'src/requests/answers';
import Page from 'src/components/Page';
import LoadingOverlay from 'src/components/LoadingOverlay';
import DisplayStatusQuestion from 'src/components/DisplayStatusQuestion';
import QuestionsTable from './QuestionsTable';
import { useProject } from '../../../project-context';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    padding: theme.spacing(2),
    flexGrow: 1
  }
}));

const QuestionsView = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = JSON.parse(localStorage.getItem('currentUser'));
  const [questions, setQuestions] = useState([]);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [openQuestion, setOpenQuestion] = useState({});
  const [openAnswers, setOpenAnswers] = useState([]);
  const [messageValue, setMessageValue] = useState('');
  const [tableOptions, setTableOptions] = useState({
    orderDesc: true,
    maskClosed: true
  });

  const {
    state: { project },
  } = useProject();

  const fetchQuestions = () => {
    setOpen(true);
    getProjectQuestionsRequest(project.url)
      .then((data) => {
        if (data.success) {
          setQuestions(data.result);
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), { variant: 'error' }))
      .finally(() => { setOpen(false); });
  };

  const fetchAnswers = () => {
    setOpen(true);
    getAnswersRequest(openQuestion.id)
      .then((data) => {
        if (data.success) {
          setOpenAnswers(data.result);
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), { variant: 'error' }))
      .finally(() => { setOpen(false); });
  };

  const deleteAnswerFromState = (answerId) => {
    const newAnswers = [...openAnswers];
    for (let i = 0; i < newAnswers.length; i++) {
      if (newAnswers[i].id === answerId) {
        newAnswers.splice(i, 1);
        setOpenAnswers(newAnswers);
        return true;
      }
    }
    return false;
  };

  const deleteAnswer = (answerId) => {
    setOpen(true);
    deleteAnswerRequest(answerId)
      .then((data) => {
        if (data.success) {
          deleteAnswerFromState(answerId);
          enqueueSnackbar('Answer successfully deleted.', { variant: 'success' });
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), { variant: 'error' }))
      .finally(() => { setOpen(false); });
  };

  const formatMessageHeader = (objectType, objectId) => {
    let url;
    switch (objectType) {
      case 'papers':
      case 'paper':
        url = `/project/${project.url}/papers`;
        break;

      case 'base_components':
        url = `/project/${project.url}/components`;
        break;

      case 'architecture':
      case 'component':
        if (objectId) url = `/project/${project.url}/${objectType}/${objectId}`;
        break;

      default:
        objectType = 'other';
    }

    if (url) {
      return (
        <Typography variant="overline">
          {`Category: ${objectType}`}
          <NavLink to={url}>
            &nbsp;(go to object)
          </NavLink>
        </Typography>
      );
    }
    return (
      <Typography variant="overline">
        {`Category: ${objectType}`}
      </Typography>
    );
  };

  const modifyQuestionStatusFromState = (questionId, newStatus) => {
    const newQuestions = [...questions];
    newQuestions.forEach((q, i) => {
      if (q.id === questionId) {
        newQuestions[i].status = newStatus;
      }
    });
    setQuestions(newQuestions);
  };

  const markAsClosed = (questionId) => {
    setOpen(true);
    markAsClosedRequest(questionId)
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Question successfully marked as closed.', { variant: 'success' });
          setOpenQuestion({
            ...openQuestion,
            status: 2
          });
          modifyQuestionStatusFromState(questionId, 2);
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), { variant: 'error' }))
      .finally(() => { setOpen(false); });
  };

  const displayMessage = () => (
    <Card>
      <CardHeader
        avatar={(
          <Avatar aria-label="recipe" className={classes.avatar}>
            {(openQuestion.first_name ? openQuestion.first_name.charAt(0) : 'U')}
          </Avatar>
        )}
        title={
          (
            (openQuestion.first_name && openQuestion.last_name && openQuestion.role)
              ? `${openQuestion.first_name} ${openQuestion.last_name}, ${openQuestion.role}`
              : 'Unknown user'
          )
        }
        subheader={new Date(openQuestion.date).toLocaleString()}
      />
      <Divider />
      <CardContent style={{ paddingTop: 0 }}>
        <Box mt={2}>
          <DisplayStatusQuestion status={openQuestion.status} />
        </Box>
        <Box mb={2}>
          {formatMessageHeader(openQuestion.object_type, openQuestion.object_id)}
        </Box>
        <Typography>
          <b>
            {openQuestion.title}
          </b>
        </Typography>
        <Typography>
          {openQuestion.content}
        </Typography>
      </CardContent>
      <Divider />
      {
        (openQuestion.username === user.username || user.is_admin)
        && parseInt(openQuestion.status, 10) !== 2
          ? (
            <CardActions>
              <Button
                size="small"
                onClick={() => markAsClosed(openQuestion.id)}
              >
                Mark question as closed
              </Button>
            </CardActions>
          )
          : <div />
      }
    </Card>
  );

  const isPostUserOrAdmin = (post) => {
    return (user.is_admin || user.username === post.username);
  };

  const displayAnswers = () => {
    return openAnswers.map((answer) => (
      <Card style={{ marginLeft: '50px', marginTop: '20px' }}>
        <CardHeader
          avatar={(
            <Avatar aria-label="recipe" className={classes.avatar}>
              {answer.first_name ? answer.first_name.charAt(0) : 'U'}
            </Avatar>
          )}
          action={
            isPostUserOrAdmin(answer) ? (
              <IconButton aria-label="delete" onClick={() => deleteAnswer(answer.id)}>
                <HighlightOffIcon />
              </IconButton>
            ) : <div />
          }
          title={answer.first_name ? `${answer.first_name} ${answer.last_name}, ${answer.role}` : 'Unknown user'}
          subheader={new Date(answer.date).toLocaleString()}
        />
        <CardContent style={{ paddingTop: 0 }}>
          <Typography>
            {answer.content}
          </Typography>
        </CardContent>
      </Card>
    ));
  };

  const submitAnswer = () => {
    if (messageValue && messageValue !== '') {
      const message = {
        username: user.username,
        content: messageValue,
        question_id: openQuestion.id,
      };
      saveAnswerRequest(message).then((data) => {
        if (data.success) {
          setOpenAnswers([
            ...openAnswers,
            {
              ...message,
              id: data.answerId,
              date: new Date().toISOString(),
              first_name: user.first_name,
              last_name: user.last_name,
              role: user.role
            }
          ]);
          modifyQuestionStatusFromState(openQuestion.id, 1);
          enqueueSnackbar('Answer successfully posted.', { variant: 'success' });
        }
      })
        .catch((error) => enqueueSnackbar(error.toString(), { variant: 'error' }))
        .finally(() => { setOpen(false); });
    }
  };

  const applyFilters = () => {
    let dpQuestions = [...questions];

    if (tableOptions.maskClosed) {
      dpQuestions = dpQuestions.filter((q) => parseInt(q.status, 10) !== 2);
    }

    if (tableOptions.orderDesc) {
      dpQuestions.sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) return -1;
        if (new Date(a.date) < new Date(b.date)) return 1;
        return 0;
      });
    } else {
      dpQuestions.sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) return 1;
        if (new Date(a.date) < new Date(b.date)) return -1;
        return 0;
      });
    }

    if (dpQuestions.length) {
      setOpenQuestion(dpQuestions[0]);
    } else {
      setOpenQuestion({});
    }
    setDisplayedQuestions(dpQuestions);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [questions, tableOptions]);

  useEffect(() => {
    if (openQuestion.id) {
      setOpenAnswers([]);
      fetchAnswers();
    }
  }, [openQuestion]);

  return (
    <Page
      className={classes.root}
      title="Questions"
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <FormGroup row>
            <FormControlLabel
              labelPlacement="top"
              component="legend"
              label="Order table"
              control={(
                <Typography component="div">
                  <Grid component="label" container alignItems="center" spacing={1}>
                    <Grid item>Asc</Grid>
                    <Grid item>
                      <Switch
                        checked={tableOptions.orderDesc}
                        onChange={() => {
                          setTableOptions({
                            ...tableOptions,
                            orderDesc: !tableOptions.orderDesc
                          });
                        }}
                        name="checkedOrder"
                      />
                    </Grid>
                    <Grid item>Desc</Grid>
                  </Grid>
                </Typography>
              )}
            />

            <FormControlLabel
              component="legend"
              label="Mask closed questions"
              labelPlacement="top"
              control={(
                <Typography component="div">
                  <Grid component="label" container alignItems="center" spacing={1}>
                    <Grid item>No</Grid>
                    <Grid item>
                      <Switch
                        checked={tableOptions.maskClosed}
                        onChange={() => {
                          setTableOptions({
                            ...tableOptions,
                            maskClosed: !tableOptions.maskClosed
                          });
                        }}
                        name="checkedOrder"
                      />
                    </Grid>
                    <Grid item>Yes</Grid>
                  </Grid>
                </Typography>
              )}
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12} md={5}>
          <QuestionsTable
            questions={displayedQuestions}
            setOpenQuestion={setOpenQuestion}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <Box>
            {openQuestion.id ? displayMessage() : <div />}
            {openQuestion.id ? displayAnswers() : <div />}
            <Card
              style={{
                marginTop: '20px',
                padding: '20px',
                display: ((parseInt(openQuestion.status, 10) === 2 || !openQuestion.id) && 'none')
              }}
            >
              <FormControl style={{ width: '100%' }}>
                <Input
                  id="answer-input"
                  value={messageValue}
                  onChange={(e) => setMessageValue(e.target.value)}
                  placeholder="Type your answer ..."
                  endAdornment={(
                    <InputAdornment position="end">
                      <IconButton
                        type="submit"
                        aria-label="send icon"
                      >
                        <SendIcon
                          onClick={submitAnswer}
                        />
                      </IconButton>
                    </InputAdornment>
                  )}
                />
              </FormControl>
            </Card>
          </Box>
        </Grid>
      </Grid>
      <LoadingOverlay open={open} />
    </Page>
  );
};

export default QuestionsView;
