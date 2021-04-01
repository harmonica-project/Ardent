import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
import Autocomplete from '@material-ui/lab/Autocomplete';

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
  const [modalStyle] = useState(getModalStyle);
  const [innerComponent, setInnerComponent] = useState(modalProps.component);
  const [helperText, setHelperText] = useState('');

  const options = baseComponents.map((option) => {
    const firstLetter = option.name[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option
    };
  });

  useEffect(() => {
    setInnerComponent(modalProps.component);
  }, [modalProps.component]);

  const handleClose = () => {
    setModalProps({
      ...modalProps,
      open: false
    });
  };

  const handleInputChange = (key, value) => {
    setInnerComponent({
      ...innerComponent,
      [key]: value
    });
  };

  const handleAutocompleteChange = (name) => {
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

  const getModalHeader = () => {
    if (modalProps.actionType === 'new') {
      return (
        <Typography variant="h2" component="h3" gutterBottom>
          {modalProps.actionType.charAt(0).toUpperCase() + modalProps.actionType.slice(1)}
        </Typography>
      );
    }

    return (
      <Box display="flex" className={classes.boxMargin}>
        <Box width="100%">
          <Typography variant="h2" gutterBottom>
            {modalProps.actionType.charAt(0).toUpperCase() + modalProps.actionType.slice(1)}
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
        <Autocomplete
          id="name-field-autocomplete"
          options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
          groupBy={(option) => option.firstLetter}
          getOptionLabel={(option) => option.name}
          defaultValue={modalProps.actionType === 'new' ? '' : modalProps.component}
          label="Component name"
          renderInput={(params) => <TextField {...params} variant="standard" helperText={helperText} onSelect={(e) => handleAutocompleteChange(e.target.value)} id="name-field" label="Component name" />}
          style={{ width: '100%' }}
          disabled={modalProps.actionType === 'view'}
          freeSolo
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
        {modalProps.actionType !== 'view' ? (
          <Button
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            className={classes.headerButton}
            onClick={() => actionModalHandler(modalProps.actionType, innerComponent)}
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
    actionType: PropTypes.string.isRequired
  }).isRequired,
  setModalProps: PropTypes.func.isRequired,
  actionModalHandler: PropTypes.func.isRequired,
  doNotShowSwitch: PropTypes.bool,
  baseComponents: PropTypes.array
};
