/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  InputAdornment,
  makeStyles,
  Input,
  IconButton,
  InputLabel,
  Card,
  Grid,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  FormControl
} from '@material-ui/core';
import {
  Send as SendIcon,
  HighlightOff as HighlightOffIcon
} from '@material-ui/icons/';
import { getQuestions as getQuestionsRequest } from 'src/requests/questions';
import { 
  getAnswers as getAnswersRequest,
  saveAnswer as saveAnswerRequest,
  deleteAnswer as deleteAnswerRequest
} from 'src/requests/answers';
import Page from 'src/components/Page';
import QuestionsTable from './QuestionsTable';
import LoadingOverlay from 'src/components/LoadingOverlay';

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
  const [questions, setQuestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [openQuestion, setOpenQuestion] = useState({});
  const [openAnswers, setOpenAnswers] = useState([]);
  const [messageValue, setMessageValue] = useState('');

  const fetchQuestions = () => {
    setOpen(true);
    getQuestionsRequest()
      .then((data) => {
        if (data.success) {
          setQuestions(data.result);
          if (data.result.length) {
            setOpenQuestion(data.result[0]);
          }
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
    let newAnswers = [...openAnswers];
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

  const displayMessage = () => (
    <Card>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {openQuestion.first_name.charAt(0)}
          </Avatar>
        }
        title={`${openQuestion.first_name} ${openQuestion.last_name}, ${openQuestion.role}`}
        subheader={new Date(openQuestion.date).toLocaleString()}
      />
      <CardContent style={{ paddingTop: 0 }}>
        <Typography>
          <b>
            {openQuestion.title}
          </b>
        </Typography>
        <Typography>
          {openQuestion.content}
        </Typography>
      </CardContent>
    </Card>
    );
  
  const isPostUserOrAdmin = (post) => {
    const user = JSON.parse(localStorage.getItem('currentUser')).user;
    return (user.is_admin || user.username === post.username);
  };

  const displayAnswers = () => {
    return openAnswers.map(answer => (
      <Card style={{ marginLeft: '50px', marginTop: '20px' }}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {answer.first_name ? answer.first_name.charAt(0) : 'U'}
            </Avatar>
          }
          action={
            isPostUserOrAdmin(answer) ? <IconButton aria-label="delete" onClick={() => deleteAnswer(answer.id)}>
              <HighlightOffIcon />
            </IconButton> : <div />
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
  }

  const submitAnswer = () => {
    if (messageValue && messageValue !== '') {
      const user = JSON.parse(localStorage.getItem('currentUser')).user;
      const message = {
        username: user.username,
        content: messageValue,
        question_id: openQuestion.id,
      }
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
          enqueueSnackbar('Answer successfully posted.', { variant: 'success' });
        }
      })
      .catch((error) => enqueueSnackbar(error.toString(), { variant: 'error' }))
      .finally(() => { setOpen(false); });
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

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
        <Grid item xs={12} md={5}>
          <QuestionsTable
            questions={questions}
            setOpenQuestion={setOpenQuestion}
          />
        </Grid>
        <Grid item xs={12} md={7}>
          <Box>
            {openQuestion.id ? displayMessage() : <div />}
            {displayAnswers()}
            <Card style={{ marginTop: '20px', padding: '20px' }}>
              <FormControl style={{ width: '100%' }}>
                <Input
                  id="answer-input"
                  value={messageValue}
                  onChange={(e) => setMessageValue(e.target.value)}
                  placeholder="Type your answer ..."
                  endAdornment={
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
                  }
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
