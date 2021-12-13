import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import nullToValue from 'src/utils/nullToValue';
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

export default function ProjectModal({
  modalProps, setModalProps, actionModalHandler
}) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const schema = yup.object().shape({
    url: yup.string()
      .max(40, 'URL is too long (40 char. max).')
      .required('URL is required'),
    name: yup.string()
      .max(40, 'Name is too long (40 char. max).')
      .required('Name is required'),
    description: yup.string()
      .max(2000, 'Description is too long (2000 char. max).')
      .transform((fieldValue) => nullToValue(fieldValue, ''))
  });

  const defaultErrorFields = {
    name: false
  };

  const defaultHelpersFields = {
    name: ''
  };
  const [modalStyle] = useState(getModalStyle);
  const [innerProject, setInnerProject] = useState(modalProps.project);
  const [errorFields, setErrorFields] = useState(defaultErrorFields);
  const [helperFields, setHelperFields] = useState(defaultHelpersFields);

  useEffect(() => {
    setInnerProject(modalProps.project);
  }, [modalProps.project]);

  const handleClose = () => {
    setModalProps({
      ...modalProps,
      open: false
    });
    setErrorFields(defaultErrorFields);
    setHelperFields(defaultHelpersFields);
  };

  const handleInputChange = (key, value) => {
    // eslint-disable-next-line
    const re = new RegExp('^[a-z0-9\-]+$');

    if ((key === 'url' && (re.test(value) || value === '')) || key !== 'url') {
      setInnerProject({
        ...innerProject,
        [key]: value
      });
    }
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

  const getModalHeader = () => {
    if (modalProps.actionType === 'new') {
      return (
        <Typography variant="h2" component="h3" gutterBottom>
          {`${modalProps.actionType.charAt(0).toUpperCase() + modalProps.actionType.slice(1)} project`}
        </Typography>
      );
    }

    return (
      <Box display="flex" className={classes.boxMargin}>
        <Box width="100%">
          <Typography variant="h2" gutterBottom>
            {`${modalProps.actionType.charAt(0).toUpperCase() + modalProps.actionType.slice(1)} project`}
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
          <Button
            color="primary"
            variant="contained"
            hidden={modalProps.actionType === 'new'}
            startIcon={modalProps.actionType === 'edit' ? <VisibilityIcon /> : <EditIcon />}
            className={classes.headerButton}
            onClick={() => handleSwitchClick()}
          >
            {modalProps.actionType === 'edit' ? 'Switch to view' : 'Switch to edit'}
          </Button>
        </Box>
      </Box>
    );
  };

  const validateAndSubmit = () => {
    const castedData = schema.cast(innerProject);
    schema.validate(castedData, { abortEarly: false })
      .then(() => {
        actionModalHandler(modalProps.actionType, castedData);
      })
      .catch((errs) => {
        console.log(errs);
        const newErrorFields = {};
        const newHelperFields = {};

        errs.inner.forEach((err) => {
          newErrorFields[err.path] = true;
          newHelperFields[err.path] = err.message;
        });

        setErrorFields({ ...errorFields, ...newErrorFields });
        setHelperFields({ ...helperFields, ...newHelperFields });
      });
  };

  const body = (
    <Box style={modalStyle} className={classes.body}>
      <Typography variant="h2" component="h2" gutterBottom>
        {getModalHeader()}
      </Typography>
      <form noValidate className={classes.form}>
        <TextField
          id="url-field"
          label="URL (only lowercase letters and hyphens)"
          placeholder="Enter project URL"
          fullWidth
          margin="normal"
          multiline
          onChange={(e) => handleInputChange('url', e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          value={innerProject.url}
          error={errorFields.url}
          helperText={helperFields.url}
        />
        <TextField
          id="name-field"
          label="Name"
          placeholder="Enter project name"
          fullWidth
          margin="normal"
          multiline
          onChange={(e) => handleInputChange('name', e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          error={errorFields.name}
          helperText={helperFields.name}
        />
        <TextField
          id="description-field"
          label="Description"
          placeholder="Enter project description"
          fullWidth
          margin="normal"
          multiline
          rows={6}
          onChange={(e) => handleInputChange('description', e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          error={errorFields.description}
          helperText={helperFields.description}
        />
        <Button
          color="primary"
          variant="contained"
          startIcon={<SaveIcon />}
          className={classes.headerButton}
          onClick={validateAndSubmit}
        >
          Create
        </Button>
      </form>
    </Box>
  );

  return (
    <div>
      <Modal
        open={modalProps.open}
        onClose={handleClose}
        aria-labelledby="name"
        aria-describedby="question-modal"
      >
        {body}
      </Modal>
    </div>
  );
}

ProjectModal.propTypes = {
  modalProps: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    project: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      url: PropTypes.string
    }),
    actionType: PropTypes.string
  }).isRequired,
  setModalProps: PropTypes.func.isRequired,
  actionModalHandler: PropTypes.func.isRequired,
};
