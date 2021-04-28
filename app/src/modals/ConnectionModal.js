import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import genValuesFromSchema from 'src/utils/genValuesFromSchema';
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
  FormHelperText,
  TextField,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel
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
  middleForm: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(2)
  },
  bottomForm: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  headerButton: {
    margin: theme.spacing(1),
  },
}));

export default function ConnectionModal({
  modalProps, setModalProps, actionModalHandler, architectureComponents, doNotShowSwitch
}) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const schema = yup.object().shape({
    first_component: yup.string()
      .required('Selecting a first component is required'),
    second_component: yup.string()
      .required('Selecting a second component is required'),
    datatype: yup.string(),
    name: yup.string(),
    direction: yup.string()
      .required('Selecting a direction is required.')
  });
  const [modalStyle] = useState(getModalStyle);
  const [innerConnection, setInnerConnection] = useState(
    genValuesFromSchema(modalProps.connection, schema)
  );
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
      second_component: false,
      direction: false
    });
    setHelpers({
      first_component: '',
      second_component: '',
      direction: false
    });
  };

  useEffect(() => {
    setInnerConnection(genValuesFromSchema(modalProps.connection, schema));
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

  const cIdToName = (id) => {
    const foundComponent = (architectureComponents.filter((ac) => ac.id === id))[0];
    if (foundComponent) return foundComponent.name;
    return id;
  };

  const body = (
    <Box style={modalStyle} className={classes.body}>
      <Typography variant="h2" component="h2" gutterBottom>
        {getModalHeader()}
      </Typography>
      <form noValidate className={classes.form}>
        <TextField
          id="name-field"
          label="Connection name"
          placeholder="Enter a connection name (Unnamed as default)"
          fullWidth
          margin="normal"
          disabled={modalProps.actionType === 'view'}
          onChange={(e) => handleInputChange('name', e.target.value)}
          defaultValue={modalProps.actionType === 'new' ? '' : modalProps.connection.name}
          InputLabelProps={{
            shrink: true,
          }}
          rows={4}
          className={classes.upperForm}
        />
        <TextField
          id="data-field"
          label="Data type"
          placeholder="Enter the type of data exchanged by components (Any as default)"
          fullWidth
          margin="normal"
          disabled={modalProps.actionType === 'view'}
          onChange={(e) => handleInputChange('datatype', e.target.value)}
          defaultValue={modalProps.actionType === 'new' ? '' : modalProps.connection.datatype}
          InputLabelProps={{
            shrink: true,
          }}
          rows={4}
          className={classes.middleForm}
        />
        <FormControl fullWidth error={errors.first_component} className={classes.middleForm}>
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
        <FormControl className={classes.middleForm} fullWidth error={errors.second_component}>
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
        <FormControl component="fieldset" style={{ width: '100%' }} className={classes.bottomForm} error={errors.direction}>
          <FormLabel component="legend">Direction</FormLabel>
          <RadioGroup row aria-label="position" name="position" defaultValue={modalProps.connection.direction ? modalProps.connection.direction : 'bidirectional'}>
            <FormControlLabel
              value="bidirectional"
              control={<Radio color="primary" />}
              label="Bidirectional"
            />
            <FormControlLabel
              value="first-to-second"
              control={<Radio color="primary" />}
              label={`
                ${innerConnection.first_component ? cIdToName(innerConnection.first_component) : 'First component'} to
                ${innerConnection.second_component ? cIdToName(innerConnection.second_component) : 'second component'}
              `}
            />
            <FormControlLabel
              value="second-to-first"
              control={<Radio color="primary" />}
              label={`
                ${innerConnection.second_component ? cIdToName(innerConnection.second_component) : 'Second component'} to
                ${innerConnection.first_component ? cIdToName(innerConnection.first_component) : 'first component'}
              `}
            />
          </RadioGroup>
          <FormHelperText>{helpers.direction}</FormHelperText>
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

ConnectionModal.propTypes = {
  modalProps: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    connection: PropTypes.shape({
      id: PropTypes.string,
      first_component: PropTypes.string,
      second_component: PropTypes.string,
      name: PropTypes.string,
      datatype: PropTypes.string,
      direction: PropTypes.string
    }),
    actionType: PropTypes.string.isRequired,
    currentComponentId: PropTypes.string
  }).isRequired,
  architectureComponents: PropTypes.array,
  setModalProps: PropTypes.func.isRequired,
  actionModalHandler: PropTypes.func.isRequired,

  doNotShowSwitch: PropTypes.bool
};
