import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Button,
  Modal,
  Typography
} from '@material-ui/core/';
import PropTypes from 'prop-types';

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
    width: '40%',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  headerButton: {
    margin: theme.spacing(1),
  },
}));

export default function ConfirmModal({
  modalProps, setModalProps
}) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);

  const body = (
    <Box style={modalStyle} className={classes.body}>
      <Typography variant="body1" gutterBottom>
        {modalProps.message}
      </Typography>
      <Button
        color="primary"
        variant="contained"
        className={classes.headerButton}
        onClick={() => {
          setModalProps({ ...modalProps, open: false });
          modalProps.actionModalHandler();
        }}
      >
        Yes
      </Button>
      <Button
        variant="contained"
        className={classes.headerButton}
        onClick={() => setModalProps({ ...modalProps, open: false })}
      >
        No
      </Button>
    </Box>
  );

  return (
    <div>
      <Modal
        open={modalProps.open}
        onClose={() => setModalProps({ ...modalProps, open: false })}
        aria-labelledby="title"
        aria-describedby="base-component-modal"
      >
        {body}
      </Modal>
    </div>
  );
}

ConfirmModal.propTypes = {
  modalProps: PropTypes.object,
  setModalProps: PropTypes.func
};
