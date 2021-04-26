import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import genValuesFromSchema from 'src/utils/genValuesFromSchema';
import * as yup from 'yup';
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl
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

export default function BasePropertyModal({
  modalProps, setModalProps, actionModalHandler, doNotShowSwitch
}) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render

  const schema = yup.object().shape({
    key: yup.string()
      .max(30, 'Property key is too long.')
      .required('Property key is required'),
    category: yup.string(),
    component_base_id: yup.string()
  });
  const [modalStyle] = useState(getModalStyle);
  const [checked, setChecked] = React.useState(true);
  const [innerProperty, setInnerProperty] = useState(
    genValuesFromSchema(modalProps.baseProperty, schema)
  );
  const [errors, setErrors] = useState({
    key: false,
    value: false
  });
  const [helpers, setHelpers] = useState({
    key: '',
    value: ''
  });

  useEffect(() => {
    setInnerProperty(genValuesFromSchema(modalProps.baseProperty, schema));
  }, [modalProps.baseProperty]);

  const resetContext = () => {
    setErrors({
      key: false,
      value: false
    });
    setHelpers({
      key: '',
      value: ''
    });
  };

  const handleClose = () => {
    setModalProps({
      ...modalProps,
      open: false
    });
    resetContext();
  };

  const handleCheck = (event) => {
    setChecked(event.target.checked);
  };

  const handleInputChange = (key, value) => {
    setErrors({ ...errors, [key]: false });
    setHelpers({ ...helpers, [key]: false });

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
    schema.validate(innerProperty, { abortEarly: false })
      .then(() => {
        actionModalHandler(modalProps.actionType, innerProperty, checked);
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
          {`${modalProps.actionType.charAt(0).toUpperCase() + modalProps.actionType.slice(1)} base property`}
        </Typography>
      );
    }

    return (
      <Box display="flex" className={classes.boxMargin}>
        <Box width="100%">
          <Typography variant="h2" gutterBottom>
            {`${modalProps.actionType.charAt(0).toUpperCase() + modalProps.actionType.slice(1)} base property`}
          </Typography>
        </Box>
        <Box flexShrink={0} className={classes.boxMargin}>
          <Button
            variant="contained"
            style={{ backgroundColor: '#f50057', color: 'white' }}
            className={classes.headerButton}
            startIcon={<DeleteIcon />}
            onClick={() => actionModalHandler('delete', innerProperty)}
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
          label="Category"
          placeholder="Enter a category name"
          fullWidth
          margin="normal"
          disabled={modalProps.actionType === 'view'}
          onChange={(e) => handleInputChange('category', e.target.value)}
          defaultValue={modalProps.actionType === 'new' ? '' : modalProps.baseProperty.category}
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
          defaultValue={modalProps.actionType === 'new' ? '' : modalProps.baseProperty.key}
          InputLabelProps={{
            shrink: true,
          }}
          error={errors.key}
          helperText={helpers.key}
        />
        {modalProps.actionType !== 'view' ? (
          <FormControl component="fieldset" fullWidth>
            <FormControlLabel
              control={
                (
                  <Checkbox
                    checked={checked}
                    onChange={handleCheck}
                    name="check-add-property"
                    color="primary"
                  />
                )
              }
              label={modalProps.actionType === 'new' ? 'Add this base property to existing component instances' : 'Apply this modification to existing instance properties'}
            />
          </FormControl>
        ) : <span />}
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

BasePropertyModal.propTypes = {
  modalProps: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    baseProperty: PropTypes.shape({
      id: PropTypes.string,
      key: PropTypes.string,
      category: PropTypes.string
    }),
    actionType: PropTypes.string.isRequired
  }).isRequired,
  setModalProps: PropTypes.func.isRequired,
  actionModalHandler: PropTypes.func.isRequired,
  doNotShowSwitch: PropTypes.bool
};
