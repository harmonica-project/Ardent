import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import genValuesFromSchema from 'src/utils/genValuesFromSchema';
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
      .max(30, 'Component name is too long.')
      .required('Base component name is required'),
    author_description: yup.string(),
    reader_description: yup.string(),
    component_base_id: yup.string()
  });
  const [modalStyle] = useState(getModalStyle);
  const [checked, setChecked] = React.useState(true);
  const [innerComponent, setInnerComponent] = useState(
    genValuesFromSchema(modalProps.component, schema)
  );
  const [helperText, setHelperText] = useState('');
  const [isBaseInputInvalid, setIsBaseInputInvalid] = useState(false);

  useEffect(() => {
    setInnerComponent(genValuesFromSchema(modalProps.component, schema));
  }, [modalProps.component]);

  const resetContext = () => {
    setHelperText('');
    setIsBaseInputInvalid(false);
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
  };

  const handleAutocompleteChange = (name) => {
    setIsBaseInputInvalid(false);

    let index = -1;
    for (let i = 0; i < baseComponents.length; i++) {
      if (baseComponents[i].name.normalize() === name.normalize()) {
        index = i;
        break;
      }
    }

    if (index === -1) {
      setHelperText('This component does not exist yet. Saving this will create a new base component.');
      setInnerComponent({
        ...innerComponent,
        name,
        component_base_id: ''
      });
    } else {
      setHelperText('');
      setInnerComponent({
        ...innerComponent,
        name,
        component_base_id: baseComponents[index].id
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
    if (modalProps.initialComponent === innerComponent.name) return false;
    if (!innerComponent.component_base_id || innerComponent.component_base_id === '') return false;
    return true;
  };

  const validateAndSubmit = () => {
    schema.validate(innerComponent, { abortEarly: false })
      .then(() => {
        actionModalHandler(
          modalProps.actionType, innerComponent, checked && isPossibleToAddBaseProperties()
        );
      })
      .catch(() => {
        setIsBaseInputInvalid(true);
        setHelperText('Component name is missing or too long (30 car. max).');
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
        <BaseComponentInput
          baseComponents={baseComponents}
          handleAutocompleteChange={handleAutocompleteChange}
          defaultValue={modalProps.actionType === 'new' ? '' : modalProps.component}
          disabled={modalProps.actionType === 'view'}
          helperText={helperText}
          error={isBaseInputInvalid}
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
