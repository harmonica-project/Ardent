import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import nullToValue from 'src/utils/nullToValue';
import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox
} from '@material-ui/core/';
import * as yup from 'yup';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Save as SaveIcon
} from '@material-ui/icons/';
import PropTypes from 'prop-types';
import BaseComponentInput from '../views/components/BaseComponentsView/BaseComponentsInput';

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

export default function ComponentModal({
  modalProps, setModalProps, actionModalHandler, doNotShowSwitch, baseComponents
}) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const schema = yup.object().shape({
    name: yup.string()
      .max(100, 'Component instance name is too long.')
      .required('Component instance name is required'),
    author_description: yup.string()
      .default('No description provided.')
      .transform((fieldValue) => nullToValue(fieldValue, 'No description provided.')),
    reader_description: yup.string()
      .default('No description provided.')
      .transform((fieldValue) => nullToValue(fieldValue, 'No description provided.')),
    component_base_id: yup.string(),
    component_base_name: yup.string()
      .required('Selecting/adding a base component is required'),
  });
  const [modalStyle] = useState(getModalStyle);
  const [checked, setChecked] = React.useState(true);
  const [innerComponent, setInnerComponent] = useState(modalProps.component);
  const [helpers, setHelpers] = useState({
    component_base_name: '',
    name: ''
  });
  const [errors, setErrors] = useState({
    component_base_name: false,
    name: false
  });

  const findBaseComponentByKey = (value, key) => {
    for (let i = 0; i < baseComponents.length; i++) {
      if (baseComponents[i][key].normalize() === value.normalize()) {
        return baseComponents[i];
      }
    }
    return false;
  };

  useEffect(() => {
    setInnerComponent({
      ...modalProps.component,
      component_base_name: () => {
        const bc = findBaseComponentByKey(modalProps.component.component_base_id, 'id');
        if (bc) return bc.id;
        return '';
      }
    });
  }, [modalProps.component]);

  const resetContext = () => {
    setHelpers({
      component_base_name: '',
      name: ''
    });
    setErrors({
      component_base_name: false,
      name: false
    });
  };

  const handleCheck = (event) => {
    setChecked(event.target.checked);
  };

  const handleClose = () => {
    setModalProps({
      ...modalProps,
      open: false
    });
    resetContext();
  };

  const handleInputChange = (key, value) => {
    setInnerComponent({
      ...innerComponent,
      [key]: value
    });

    if (key === 'name') {
      setErrors({ ...errors, name: false });
      setHelpers({ ...helpers, name: '' });
    }
  };

  const handleAutocompleteChange = (name) => {
    setErrors({
      ...errors,
      component_base_name: false
    });

    const baseComponent = findBaseComponentByKey(name, 'name');

    if (!baseComponent) {
      setHelpers({
        ...helpers,
        component_base_name: 'This component does not exist yet. Saving this will create a new base component.'
      });
      setInnerComponent({
        ...innerComponent,
        component_base_id: '',
        component_base_name: name
      });
    } else {
      setHelpers({
        ...helpers,
        component_base_name: ''
      });
      setInnerComponent({
        ...innerComponent,
        component_base_id: baseComponent.id,
        component_base_name: name
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

  const isPossibleToAddBaseProperties = () => {
    if (modalProps.actionType === 'view') return false;
    if (modalProps.initialComponent === innerComponent.component_base_id) return false;
    if (!innerComponent.component_base_id || innerComponent.component_base_id === '') return false;
    return true;
  };

  const validateAndSubmit = () => {
    const castedData = schema.cast(innerComponent);
    schema.validate(castedData, { abortEarly: false })
      .then(() => {
        actionModalHandler(
          modalProps.actionType, castedData, checked && isPossibleToAddBaseProperties()
        );
      })
      .catch((errs) => {
        const newErrorFields = {};
        const newHelperFields = {};

        errs.inner.forEach((err) => {
          newErrorFields[err.path] = true;
          newHelperFields[err.path] = err.message;
        });

        setErrors({ ...errors, ...newErrorFields });
        setHelpers({ ...helpers, ...newHelperFields });
      });
  };

  const getModalHeader = () => {
    if (modalProps.actionType === 'new') {
      return (
        <Typography variant="h2" component="h3" gutterBottom>
          {`${modalProps.actionType.charAt(0).toUpperCase() + modalProps.actionType.slice(1)} component instance`}
        </Typography>
      );
    }

    return (
      <Box display="flex" className={classes.boxMargin}>
        <Box width="100%">
          <Typography variant="h2" gutterBottom>
            {`${modalProps.actionType.charAt(0).toUpperCase() + modalProps.actionType.slice(1)} component instance`}
          </Typography>
        </Box>
        <Box flexShrink={0} className={classes.boxMargin}>
          <Button
            variant="contained"
            style={{ backgroundColor: '#f50057', color: 'white' }}
            className={classes.headerButton}
            startIcon={<DeleteIcon />}
            onClick={() => actionModalHandler('delete', innerComponent)}
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
        <BaseComponentInput
          baseComponents={baseComponents}
          handleAutocompleteChange={handleAutocompleteChange}
          defaultValue={modalProps.actionType === 'new' ? '' : modalProps.component}
          disabled={modalProps.actionType === 'view'}
          helperText={helpers.component_base_name}
          error={errors.component_base_name}
        />
        <TextField
          id="name-field"
          label="Component instance name"
          placeholder="Enter component instance name (the same as introduced in the paper)"
          fullWidth
          margin="normal"
          disabled={modalProps.actionType === 'view'}
          onChange={(e) => handleInputChange('name', e.target.value)}
          defaultValue={modalProps.actionType === 'new' ? '' : modalProps.component.name}
          InputLabelProps={{
            shrink: true,
          }}
          helperText={helpers.name}
          error={errors.name}
        />
        <TextField
          id="author-description-field"
          label="Author description"
          placeholder="Enter component description from author standpoint"
          fullWidth
          margin="normal"
          disabled={modalProps.actionType === 'view'}
          onChange={(e) => handleInputChange('author_description', e.target.value)}
          defaultValue={modalProps.actionType === 'new' ? '' : modalProps.component.author_description}
          InputLabelProps={{
            shrink: true,
          }}
          multiline
          rows={4}
        />
        <TextField
          id="reader-description-field"
          label="Reader description"
          placeholder="Enter component description from reader standpoint"
          fullWidth
          margin="normal"
          disabled={modalProps.actionType === 'view'}
          onChange={(e) => handleInputChange('reader_description', e.target.value)}
          defaultValue={modalProps.actionType === 'new' ? '' : modalProps.component.reader_description}
          InputLabelProps={{
            shrink: true,
          }}
          multiline
          rows={4}
        />
        {isPossibleToAddBaseProperties() ? (
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
              label="Add base component properties to created instance"
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
        aria-describedby="component-modal"
      >
        {body}
      </Modal>
    </div>
  );
}

ComponentModal.propTypes = {
  modalProps: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    component: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      reader_description: PropTypes.string,
      author_description: PropTypes.string,
      architecture_id: PropTypes.string,
      component_base_id: PropTypes.string
    }),
    initialComponent: PropTypes.string,
    actionType: PropTypes.string.isRequired
  }).isRequired,
  setModalProps: PropTypes.func.isRequired,
  actionModalHandler: PropTypes.func.isRequired,
  doNotShowSwitch: PropTypes.bool,
  baseComponents: PropTypes.array
};
