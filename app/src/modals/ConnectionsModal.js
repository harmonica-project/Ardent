import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as yup from 'yup';
import {
  Box,
  Typography,
  Button,
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText
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
  upperForm: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(2),
  },
  bottomForm: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3)
  },
  headerButton: {
    margin: theme.spacing(1),
  },
}));

export default function ConnectionsModal({
  modalProps, setModalProps, actionModalHandler, architectureComponents, doNotShowSwitch
}) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [innerConnection, setInnerConnection] = useState(modalProps.connection);
  const [errors, setErrors] = useState({
    first_component: false,
    second_component: false
  });
  const [helpers, setHelpers] = useState({
    first_component: '',
    second_component: ''
  });

  const resetContext = () => {
    setErrors({
      first_component: false,
      second_component: false
    });
    setHelpers({
      first_component: '',
      second_component: ''
    });
  };

  useEffect(() => {
    setInnerConnection(modalProps.connection);
  }, [modalProps.connection]);

  const handleClose = () => {
    setModalProps({
      ...modalProps,
      open: false
    });
    resetContext();
  };

  const handleInputChange = (key, value) => {
    setErrors({ ...errors, [key]: false });
    setHelpers({ ...helpers, [key]: false });

    setInnerConnection({
      ...innerConnection,
      [key]: value
    });
  };

  const validateAndSubmit = () => {
    const checkPres = (first, second) => {
      return (first === modalProps.currentComponentId || second === modalProps.currentComponentId);
    };

    const schema = yup.object().shape({
      first_component: yup.string()
        .required('Selecting a first component is required'),
      second_component: yup.string()
        .required('Selecting a second component is required'),
    });
    console.log(innerConnection);
    schema.validate(innerConnection, { abortEarly: false })
      .then(() => {
        if (checkPres(innerConnection.first_component, innerConnection.second_component)) {
          actionModalHandler(modalProps.actionType, innerConnection);
        } else {
          setErrors({
            first_component: true,
            second_component: true
          });
          setHelpers({
            first_component: 'At least one component must be the current instance.',
            second_component: 'At least one component must be the current instance.'
          });
        }
      })
      .catch((err) => {
        let newErrors = {};
        let newHelpers = {};
        err.inner.forEach((field) => {
          newErrors = { ...newErrors, [field.path]: true };
          newHelpers = { ...newHelpers, [field.path]: field.message };
        });
        setErrors({ ...errors, ...newErrors });
        setHelpers({ ...helpers, ...newHelpers });
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

  const getModalHeader = () => {
    if (modalProps.actionType === 'new') {
      return (
        <Typography variant="h2" component="h3" gutterBottom>
          {`${modalProps.actionType.charAt(0).toUpperCase() + modalProps.actionType.slice(1)} connection`}
        </Typography>
      );
    }

    return (
      <Box display="flex" className={classes.boxMargin}>
        <Box width="100%">
          <Typography variant="h2" gutterBottom>
            {`${modalProps.actionType.charAt(0).toUpperCase() + modalProps.actionType.slice(1)} connection`}
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
        <FormControl className={classes.upperForm} fullWidth error={errors.first_component}>
          <InputLabel id="first-component-label">First component</InputLabel>
          <Select
            labelId="first-component-select"
            id="first-component-select"
            onChange={(e) => { handleInputChange('first_component', e.target.value); }}
            fullWidth
            margin="normal"
            label="First component"
            disabled={modalProps.actionType === 'view'}
            defaultValue={modalProps.actionType === 'new' ? modalProps.currentComponentId : modalProps.connection.first_component}
          >
            <MenuItem value="">
              <em>Select a first component</em>
            </MenuItem>
            {
              architectureComponents.map((c) => (
                <MenuItem value={c.id}>{c.name}</MenuItem>
              ))
            }
          </Select>
          <FormHelperText>{helpers.first_component}</FormHelperText>
        </FormControl>
        <FormControl className={classes.bottomForm} fullWidth error={errors.second_component}>
          <InputLabel id="second-component-label">Second component</InputLabel>
          <Select
            labelId="second-component-select"
            id="second-component-select"
            onChange={(e) => { handleInputChange('second_component', e.target.value); }}
            fullWidth
            margin="normal"
            disabled={modalProps.actionType === 'view'}
            defaultValue={modalProps.actionType === 'new' ? '' : modalProps.connection.second_component}
          >
            <MenuItem value="">
              <em>Select a second component</em>
            </MenuItem>
            {
              architectureComponents.map((c) => (
                <MenuItem value={c.id}>{c.name}</MenuItem>
              ))
            }
          </Select>
          <FormHelperText>{helpers.second_component}</FormHelperText>
        </FormControl>
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
        aria-describedby="connection-modal"
      >
        {body}
      </Modal>
    </div>
  );
}

ConnectionsModal.propTypes = {
  modalProps: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    connection: PropTypes.shape({
      id: PropTypes.string,
      first_component: PropTypes.string,
      second_component: PropTypes.string,
    }),
    actionType: PropTypes.string.isRequired,
    currentComponentId: PropTypes.string
  }).isRequired,
  architectureComponents: PropTypes.array,
  setModalProps: PropTypes.func.isRequired,
  actionModalHandler: PropTypes.func.isRequired,

  doNotShowSwitch: PropTypes.bool
};
