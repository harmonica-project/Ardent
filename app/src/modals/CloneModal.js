import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as yup from 'yup';
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField
} from '@material-ui/core/';
import { FileCopy as CopyIcon } from '@material-ui/icons';
import PropTypes from 'prop-types';
import PaperAutocomplete from 'src/views/papers/PaperListView/PaperAutocomplete';

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

export default function CloneModal({
  modalProps, setModalProps, actionModalHandler
}) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [transferInfo, setTransferInfo] = useState({
    architecture_id: modalProps.architecture,
    paper_id: ''
  });

  const [error, setError] = useState(false);
  const [helper, setHelper] = useState('');

  useEffect(() => {
    setTransferInfo({ ...transferInfo, architecture_id: modalProps.architecture.id });
  }, [modalProps.architecture]);

  const handleClose = () => {
    setModalProps({
      ...modalProps,
      open: false
    });
    setHelper('');
    setError(false);
  };

  const validateAndSubmit = () => {
    console.log(transferInfo);
    const schema = yup.object().shape({
      paper_id: yup.string()
        .required('You must select a paper target.'),
      architecture_id: yup.string()
    });

    schema.validate(transferInfo, { abortEarly: false })
      .then(() => {
        actionModalHandler(transferInfo);
      })
      .catch(() => {
        setError(true);
        setHelper('You must select a paper target.');
      });
  };

  const body = (
    <Box style={modalStyle} className={classes.body}>
      <Typography variant="h2">
        Clone source architecture to paper
      </Typography>
      <Box mt={1}>
        <TextField
          id="source-architecture-name-field"
          label="Source architecture"
          placeholder="Unknown"
          fullWidth
          margin="normal"
          disabled
          value={`${modalProps.architecture.name} (${modalProps.architecture.id})`}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <PaperAutocomplete
          papers={modalProps.papers}
          changeHandler={(selected) => {
            setTransferInfo({ ...transferInfo, paper_id: selected });
            setError(false);
            setHelper('');
          }}
          label="Destination paper"
          error={error}
          helperText={helper}
        />
      </Box>
      <Box mt={2}>
        <Button
          color="primary"
          variant="contained"
          startIcon={<CopyIcon />}
          className={classes.headerButton}
          onClick={validateAndSubmit}
        >
          Clone
        </Button>
      </Box>
    </Box>
  );

  return (
    <div>
      <Modal
        open={modalProps.open}
        onClose={handleClose}
        aria-labelledby="title"
        aria-describedby="architecture-clone-modal"
      >
        {body}
      </Modal>
    </div>
  );
}

CloneModal.propTypes = {
  modalProps: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    architecture: PropTypes.object,
    papers: PropTypes.array
  }).isRequired,
  setModalProps: PropTypes.func.isRequired,
  actionModalHandler: PropTypes.func.isRequired
};
