import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import nullToValue from 'src/utils/nullToValue';
import * as yup from 'yup';
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Grid
} from '@material-ui/core/';
import {
  Send as SendIcon
} from '@material-ui/icons/';
import PropTypes from 'prop-types';
import authenticationService from 'src/requests/authentication';
import { useSnackbar } from 'notistack';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  body: {
    position: 'absolute',
    width: '60%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  headerButton: {
    margin: theme.spacing(1),
  },
}));

export default function QuestionModal({
  modalProps, setModalProps, actionModalHandler
}) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const { enqueueSnackbar } = useSnackbar();
  const schema = yup.object().shape({
    title: yup.string()
      .max(200, 'Title is too long (200 char. max).')
      .required('Title is required'),
    content: yup.string()
      .max(2000, 'Text is too long (2000 char. max).')
      .required('Text is required')
      .transform((fieldValue) => nullToValue(fieldValue, '')),
    username: yup.string().required(),
    object_id: yup.string()
  });

  const defaultErrorFields = {
    title: false,
    content: false
  };

  const defaultHelpersFields = {
    title: '',
    content: ''
  };
  const [modalStyle] = useState(getModalStyle);
  const [innerQuestion, setInnerQuestion] = useState(modalProps.question);
  const [errorFields, setErrorFields] = useState(defaultErrorFields);
  const [helperFields, setHelperFields] = useState(defaultHelpersFields);
  useEffect(() => {
    setInnerQuestion(modalProps.question);
  }, [modalProps.question]);

  const handleClose = () => {
    setModalProps({
      ...modalProps,
      open: false
    });
    setErrorFields(defaultErrorFields);
    setHelperFields(defaultHelpersFields);
  };

  const handleInputChange = (key, value) => {
    setInnerQuestion({
      ...innerQuestion,
      [key]: value
    });
  };

  const validateAndSubmit = () => {
    const castedData = schema.cast({
      ...innerQuestion,
      object_id: modalProps.context.id,
      object_type: modalProps.context.type
    });
    const { username } = authenticationService.currentUserValue.user;
    schema.validate({ ...castedData, username }, { abortEarly: false })
      .then(() => {
        actionModalHandler({ ...castedData, username });
      })
      .catch((errs) => {
        const newErrorFields = {};
        const newHelperFields = {};

        errs.inner.forEach((err) => {
          if (err.path !== 'username') {
            newErrorFields[err.path] = true;
            newHelperFields[err.path] = err.message;
          } else {
            enqueueSnackbar('Error: cannot get current username. Please reload the app.', { variant: 'error' });
          }
        });

        setErrorFields({ ...errorFields, ...newErrorFields });
        setHelperFields({ ...helperFields, ...newHelperFields });
      });
  };

  const body = (
    <Box style={modalStyle} className={classes.body}>
      <Typography variant="h2" component="h3" gutterBottom>
        New question
      </Typography>
      <form noValidate className={classes.form}>
        <Grid container spacing={1}>
          <Grid item md={4} xs={12}>
            <TextField
              id="type-field"
              label="Type"
              placeholder="Unknown"
              fullWidth
              margin="normal"
              value={modalProps.context.type}
              disabled
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              id="name-field"
              label="Name"
              placeholder="Unknown"
              fullWidth
              margin="normal"
              value={modalProps.context.name}
              disabled
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <TextField
              id="id-field"
              label="ID"
              placeholder="Unknown"
              fullWidth
              margin="normal"
              value={modalProps.context.id}
              disabled
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        <TextField
          id="title-field"
          label="Title"
          placeholder="Enter question title"
          fullWidth
          margin="normal"
          multiline
          onChange={(e) => handleInputChange('title', e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          error={errorFields.title}
          helperText={helperFields.title}
        />
        <TextField
          id="content-field"
          label="Content"
          placeholder="Enter question text"
          fullWidth
          margin="normal"
          multiline
          rows={6}
          onChange={(e) => handleInputChange('content', e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          error={errorFields.content}
          helperText={helperFields.content}
        />
        <Button
          color="primary"
          variant="contained"
          startIcon={<SendIcon />}
          className={classes.headerButton}
          onClick={validateAndSubmit}
        >
          Submit
        </Button>
      </form>
    </Box>
  );

  return (
    <div>
      <Modal
        open={modalProps.open}
        onClose={handleClose}
        aria-labelledby="title"
        aria-describedby="question-modal"
      >
        {body}
      </Modal>
    </div>
  );
}

QuestionModal.propTypes = {
  modalProps: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    context: PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string
    }),
    question: PropTypes.shape({
      id: PropTypes.string,
      date: PropTypes.string,
      title: PropTypes.string,
      content: PropTypes.string
    }),
  }).isRequired,
  setModalProps: PropTypes.func.isRequired,
  actionModalHandler: PropTypes.func.isRequired
};
