import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Container,
  makeStyles,
  Button
} from '@material-ui/core';
import QuestionModal from 'src/modals/QuestionModal';
import { saveQuestion as saveQuestionRequest } from 'src/requests/questions';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%'
  }
}));

const QuestionsView = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [modalProps, setModalProps] = useState({
    open: false,
  });
  const openTestQuesModal = () => {
    setModalProps({
      ...modalProps,
      open: true,
    });
  };

  const actionModalHandler = (question) => {
    saveQuestionRequest(question)
      .then((data) => {
        if (data.success) {
          enqueueSnackbar('Success', { variant: 'success' });
        } else {
          enqueueSnackbar(JSON.stringify(data), { variant: 'error' });
        }
      })
      .catch((err) => {
        enqueueSnackbar(err, { variant: 'error' });
      });
  };

  return (
    <Page
      className={classes.root}
      title="Questions"
    >
      <Container maxWidth={false}>
        <Box
          mt={3}
          display="flex"
          justifyContent="center"
        >
          <Button color="primary" variant="contained" onClick={openTestQuesModal}>
            Test
          </Button>
        </Box>
      </Container>
      <QuestionModal
        modalProps={modalProps}
        setModalProps={setModalProps}
        actionModalHandler={actionModalHandler}
      />
    </Page>
  );
};

export default QuestionsView;
