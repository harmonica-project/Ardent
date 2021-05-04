/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Container,
  makeStyles,
  Button,
  Card,
  Grid
} from '@material-ui/core';
import { getQuestions as getQuestionsRequest } from 'src/requests/questions';
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
      .catch((error) => enqueueSnackbar(error, 'error'))
      .finally(() => { setOpen(false); });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

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
            <Card>{openQuestion.id}</Card>
          </Box>
        </Grid>
      </Grid>
      <LoadingOverlay open={open} />
    </Page>
  );
};

export default QuestionsView;
