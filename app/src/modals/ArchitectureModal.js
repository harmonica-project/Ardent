import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as yup from 'yup';
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField
} from '@material-ui/core/';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Save as SaveIcon
} from '@material-ui/icons/';
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

export default function ArchitectureModal({
  modalProps, setModalProps, actionModalHandler, doNotShowSwitch
}) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render

  const schema = yup.object().shape({
    name: yup.string()
      .max(30, 'Architecture name is too long.')
      .default('Unnamed'),
    author_description: yup.string()
      .default('No description provided.'),
    reader_description: yup.string()
      .default('No description provided.'),
  });

  const [modalStyle] = useState(getModalStyle);
  const [innerArchitecture, setInnerArchitecture] = useState(modalProps.architecture);

  useEffect(() => {
    setInnerArchitecture(modalProps.architecture);
  }, [modalProps.architecture]);

  const handleClose = () => {
    setModalProps({
      ...modalProps,
      open: false
    });
  };

  const handleInputChange = (key, value) => {
    setInnerArchitecture({
      ...innerArchitecture,
      [key]: value
    });
  };

  const handleSwitchClick = () => {
    if (modalProps.actionType === 'new') return;
    if (modalProps.actionType === 'edit') {
      setModalProps({
        ...modalProps,
        actionType: 'view'
      });
    } else if (modalProps.actionType === 'view') {
      setModalProps({
        ...modalProps,
        actionType: 'edit'
      });
    }
  };

  const validateAndSubmit = () => {
    const castedData = schema.cast(innerArchitecture);
    actionModalHandler(modalProps.actionType, castedData);
  };

  const getModalHeader = () => {
    if (modalProps.actionType === 'new') {
      return (
        <Typography variant="h2" component="h3" gutterBottom>
          {`${modalProps.actionType.charAt(0).toUpperCase() + modalProps.actionType.slice(1)} architecture`}
        </Typography>
      );
    }

    return (
      <Box display="flex" className={classes.boxMargin}>
        <Box width="100%">
          <Typography variant="h2" gutterBottom>
            {`${modalProps.actionType.charAt(0).toUpperCase() + modalProps.actionType.slice(1)} architecture`}
          </Typography>
        </Box>
        <Box flexShrink={0} className={classes.boxMargin}>
          <Button
            variant="contained"
            style={{ backgroundColor: '#f50057', color: 'white' }}
            className={classes.headerButton}
            startIcon={<DeleteIcon />}
            onClick={() => actionModalHandler('delete')}
          >
            Delete
          </Button>
          {!doNotShowSwitch && (
          <Button
            color="primary"
            variant="contained"
            startIcon={modalProps.actionType === 'edit' ? <VisibilityIcon /> : <EditIcon />}
            className={classes.headerButton}
            onClick={() => handleSwitchClick()}
          >
            {modalProps.actionType === 'edit' ? 'Switch to view' : 'Switch to edit'}
          </Button>
          )}
        </Box>
      </Box>
    );
  };

  const body = (
    <Box style={modalStyle} className={classes.body}>
      <Typography variant="h2" component="h2" gutterBottom>
        {getModalHeader()}
      </Typography>
      <form noValidate className={classes.form}>
        <TextField
          id="name-field"
          label="Name"
          placeholder="Enter architecture name"
          fullWidth
          margin="normal"
          disabled={modalProps.actionType === 'view'}
          onChange={(e) => handleInputChange('name', e.target.value)}
          defaultValue={modalProps.actionType === 'new' ? '' : modalProps.architecture.name}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="reader-description-field"
          label="Reader description"
          placeholder="Enter architecture description from reader standpoint"
          fullWidth
          margin="normal"
          disabled={modalProps.actionType === 'view'}
          onChange={(e) => handleInputChange('reader_description', e.target.value)}
          defaultValue={modalProps.actionType === 'new' ? '' : modalProps.architecture.reader_description}
          InputLabelProps={{
            shrink: true,
          }}
          multiline
          rows={4}
        />
        <TextField
          id="author-description-field"
          label="Author description"
          placeholder="Enter architecture description from author standpoint"
          fullWidth
          margin="normal"
          disabled={modalProps.actionType === 'view'}
          onChange={(e) => handleInputChange('author_description', e.target.value)}
          defaultValue={modalProps.actionType === 'new' ? '' : modalProps.architecture.author_description}
          InputLabelProps={{
            shrink: true,
          }}
          multiline
          rows={4}
        />
        {modalProps.actionType !== 'view' ? (
          <Button
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            className={classes.headerButton}
            onClick={validateAndSubmit}
          >
            Save
          </Button>
        ) : <span />}
      </form>
    </Box>
  );

  return (
    <div>
      <Modal
        open={modalProps.open}
        onClose={handleClose}
        aria-labelledby="title"
        aria-describedby="architecture-modal"
      >
        {body}
      </Modal>
    </div>
  );
}

ArchitectureModal.propTypes = {
  modalProps: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    architecture: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      reader_description: PropTypes.string,
      author_description: PropTypes.string,
      paper_id: PropTypes.string
    }),
    actionType: PropTypes.string.isRequired
  }).isRequired,
  setModalProps: PropTypes.func.isRequired,
  actionModalHandler: PropTypes.func.isRequired,
  doNotShowSwitch: PropTypes.bool
};
