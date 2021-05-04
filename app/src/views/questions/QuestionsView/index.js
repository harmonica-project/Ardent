/* eslint-disable */
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Container,
  makeStyles,
  Button,
  Grid
} from '@material-ui/core';
import QuestionModal from 'src/modals/QuestionModal';
import { saveQuestion as saveQuestionRequest } from 'src/requests/questions';
import Page from 'src/components/Page';
import QuestionsTable from './QuestionsTable';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    padding: theme.spacing(3)
  }
}));

const QuestionsView = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Page
      className={classes.root}
      title="Questions"
    >
      <Grid container>
        <Grid item xs={12} md={5}>
          <QuestionsTable/>
        </Grid>
        <Grid item xs={12} md={7}>

        </Grid>
      </Grid>
    </Page>
  );
};

export default QuestionsView;
