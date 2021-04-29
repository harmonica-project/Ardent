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

export default function InstancePropertyModal({
  modalProps, setModalProps, actionModalHandler, doNotShowSwitch
}) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render

  const schema = yup.object().shape({
    key: yup.string()
      .max(30, 'Property key is too long.')
      .required('Property key is required'),
    value: yup.string()
      .max(30, 'Property value is too long.')
      .default('Undefined')
      .transform((directionValue) => nullToValue(directionValue, 'Undefined')),
    category: yup.string()
  });
  const [modalStyle] = useState(getModalStyle);
  const [innerProperty, setInnerProperty] = useState(modalProps.property);
  const [error, setError] = useState(false);
  const [helper, setHelper] = useState('');

  useEffect(() => {
    setInnerProperty(modalProps.property);
  }, [modalProps.property]);

  const resetContext = () => {
    setError(false);
    setHelper('');
  };

  const handleClose = () => {
    setModalProps({
      ...modalProps,
      open: false
    });
    resetContext();
  };

  const handleInputChange = (key, value) => {
    if (key === 'key') {
      setError(false);
      setHelper('');
    }

    if (key === 'category') {
      setInnerProperty({
        ...innerProperty,
        category: (value.length ? (value.charAt(0).toUpperCase() + value.slice(1)) : value)
      });
    } else {
      setInnerProperty({
        ...innerProperty,
        [key]: value
      });
    }
  };

  const validateAndSubmit = () => {
    const castedData = schema.cast(innerProperty);
    schema.validate(castedData, { abortEarly: false })
      .then(() => {
        actionModalHandler(modalProps.actionType, castedData);
      })
      .catch(() => {
        setError(true);
        setHelper('Property key is required');
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
          {`${modalProps.actionType.charAt(0).toUpperCase() + modalProps.actionType.slice(1)} property instance`}
        </Typography>
      );
    }

    return (
      <Box display="flex" className={classes.boxMargin}>
        <Box width="100%">
          <Typography variant="h2" gutterBottom>
            {`${modalProps.actionType.charAt(0).toUpperCase() + modalProps.actionType.slice(1)} property instance`}
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
          id="category-field"
          label="Category (Other by default)"
          placeholder="Enter a category name"
          fullWidth
          margin="normal"
          disabled={modalProps.actionType === 'view'}
          onChange={(e) => handleInputChange('category', e.target.value)}
          defaultValue={modalProps.actionType === 'new' ? '' : modalProps.property.category}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="key-field"
          label="Key"
          placeholder="Enter a property key"
          fullWidth
          margin="normal"
          disabled={modalProps.actionType === 'view'}
          onChange={(e) => handleInputChange('key', e.target.value)}
          defaultValue={modalProps.actionType === 'new' ? '' : modalProps.property.key}
          InputLabelProps={{
            shrink: true,
          }}
          error={error}
          helperText={helper}
        />
        <TextField
          id="value-field"
          label="Value (Undefined by default)"
          placeholder="Enter a property value"
          fullWidth
          margin="normal"
          disabled={modalProps.actionType === 'view'}
          onChange={(e) => handleInputChange('value', e.target.value)}
          defaultValue={modalProps.actionType === 'new' ? '' : modalProps.property.value}
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
        aria-describedby="property-modal"
      >
        {body}
      </Modal>
    </div>
  );
}

InstancePropertyModal.propTypes = {
  modalProps: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    property: PropTypes.shape({
      id: PropTypes.string,
      key: PropTypes.string,
      value: PropTypes.string,
      category: PropTypes.string
    }),
    actionType: PropTypes.string.isRequired
  }).isRequired,
  setModalProps: PropTypes.func.isRequired,
  actionModalHandler: PropTypes.func.isRequired,
  doNotShowSwitch: PropTypes.bool
};
