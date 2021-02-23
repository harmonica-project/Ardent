import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  TextField,
  Box,
  Typography,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel,
  Grid,
  Button,
  Modal
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
    width: '80%',
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

export default function PaperModal({ modalProps, setModalProps, actionModalHandler }) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [innerPaper, setInnerPaper] = React.useState(modalProps.paper);

  useEffect(() => {
    setInnerPaper(modalProps.paper);
  }, [modalProps.paper]);

  const handleClose = () => {
    setModalProps({
      ...modalProps,
      open: false
    });
  };

  const handleInputChange = (key, value) => {
    setInnerPaper({
      ...innerPaper,
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
          <Button
            color="primary"
            variant="contained"
            hidden={modalProps.actionType === 'new'}
            startIcon={modalProps.actionType === 'edit' ? <EditIcon /> : <VisibilityIcon />}
            className={classes.headerButton}
            onClick={() => handleSwitchClick()}
          >
            {modalProps.actionType === 'edit' ? 'Switch to view' : 'Switch to edit'}
          </Button>
        </Box>
      </Box>
    );
  };

  const displayPaperSubtitle = () => {
    if (modalProps.actionType !== 'new') {
      return (
        <Typography variant="subtitle1" gutterBottom>
          <i>
            &rdquo;
            {modalProps.paper.name}
            &rdquo;
          </i>
        </Typography>
      );
    }
    return (<span />);
  };

  const setPaperTypeDefault = () => {
    const definedValues = ['inproceedings', 'article', 'book'];

    if (modalProps.actionType === 'new') return '';
    if (definedValues.includes(modalProps.paper.paper_type)) return modalProps.paper.paper_type;
    return 'other';
  };

  const body = (
    <Box style={modalStyle} className={classes.body}>
      <Typography variant="h2" component="h2" gutterBottom>
        {getModalHeader()}
      </Typography>
      {displayPaperSubtitle()}
      <form noValidate className={classes.form}>
        <Grid container spacing={4}>
          <Grid container item xs={6}>
            <Grid container item xs={4}>
              <FormControl className={classes.formControl} style={{ width: '100%' }} margin="normal">
                <InputLabel shrink id="added-by-select-label" disabled={modalProps.actionType === 'view'}>
                  Added by
                </InputLabel>
                <Select
                  labelId="added-by-select-label"
                  id="added-by-select"
                  disabled
                  displayEmpty
                  defaultValue={modalProps.actionType === 'new' ? localStorage.getItem('username') : modalProps.paper.added_by}
                  className={classes.selectEmpty}
                >
                  <MenuItem value="six">Nicolas Six</MenuItem>
                  <MenuItem value="negri">Claudia Negri Ribalta</MenuItem>
                  <MenuItem value="herbaut">Nicolas Herbaut</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid container item xs={4}>
              <FormControl className={classes.formControl} style={{ width: '100%' }} margin="normal">
                <InputLabel shrink id="updated-by-select-label" disabled={modalProps.actionType === 'view'}>
                  Updated by
                </InputLabel>
                <Select
                  labelId="updated-by-select-label"
                  id="updated-by-select"
                  disabled={modalProps.actionType === 'view'}
                  displayEmpty
                  onChange={(e) => handleInputChange('updated_by', e.target.value)}
                  defaultValue={modalProps.actionType === 'new' ? '' : modalProps.paper.updated_by}
                  className={classes.selectEmpty}
                >
                  <MenuItem value="" disabled>
                    Updated by?
                  </MenuItem>
                  <MenuItem value="six">Nicolas Six</MenuItem>
                  <MenuItem value="negri">Claudia Negri Ribalta</MenuItem>
                  <MenuItem value="herbaut">Nicolas Herbaut</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid container item xs={4}>
              <FormControl className={classes.formControl} style={{ width: '100%' }} margin="normal">
                <InputLabel shrink id="status-select-label" disabled={modalProps.actionType === 'view'}>
                  Status
                </InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  disabled={modalProps.actionType !== 'edit'}
                  displayEmpty
                  defaultValue={modalProps.actionType === 'new' ? 0 : modalProps.paper.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className={classes.selectEmpty}
                >
                  <MenuItem value={0}>Just added</MenuItem>
                  <MenuItem value={1}>In progress</MenuItem>
                  <MenuItem value={2}>Done</MenuItem>
                  <MenuItem value={3}>Need help</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid>
              <TextField
                id="name-field"
                label="Paper name"
                placeholder="Enter paper name"
                fullWidth
                margin="normal"
                multiline
                disabled={modalProps.actionType === 'view'}
                defaultValue={modalProps.actionType === 'new' ? '' : modalProps.paper.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="doi-field"
                label="DOI"
                placeholder="Enter DOI"
                fullWidth
                margin="normal"
                disabled={modalProps.actionType === 'view'}
                onChange={(e) => handleInputChange('doi', e.target.value)}
                defaultValue={modalProps.actionType === 'new' ? '' : modalProps.paper.doi}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="authors-field"
                label="Authors"
                placeholder="Enter authors"
                fullWidth
                margin="normal"
                disabled={modalProps.actionType === 'view'}
                onChange={(e) => handleInputChange('authors', e.target.value)}
                defaultValue={modalProps.actionType === 'new' ? '' : modalProps.paper.authors}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <FormControl className={classes.formControl} style={{ width: '100%' }} margin="normal">
                <InputLabel shrink id="paper-type-select-label" disabled={modalProps.actionType === 'view'}>
                  Paper type
                </InputLabel>
                <Select
                  labelId="paper-type-select-label"
                  id="paper-type-select"
                  disabled={modalProps.actionType === 'view'}
                  defaultValue={setPaperTypeDefault()}
                  onChange={(e) => handleInputChange('paper_type', e.target.value)}
                  displayEmpty
                  className={classes.selectEmpty}
                >
                  <MenuItem value="" disabled>
                    Paper type?
                  </MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                  <MenuItem value="article">Journal article</MenuItem>
                  <MenuItem value="book">Book</MenuItem>
                  <MenuItem value="inproceedings">Conference paper</MenuItem>
                </Select>
                <FormHelperText disabled={modalProps.actionType === 'view'}>
                  Select
                  <i>
                    &nbsp;
                    Other
                    &nbsp;
                  </i>
                  if your type is not present.
                </FormHelperText>
              </FormControl>
              <TextField
                id="journal-field"
                label="Journal (id. the support where the publication were made)"
                placeholder="Enter journal"
                fullWidth
                margin="normal"
                disabled={modalProps.actionType === 'view'}
                onChange={(e) => handleInputChange('journal', e.target.value)}
                defaultValue={modalProps.actionType === 'new' ? '' : modalProps.paper.journal}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <Grid container item xs={6}>
            <TextField
              id="abstract-field"
              label="Abstract"
              placeholder="Enter paper abstract"
              fullWidth
              margin="normal"
              multiline
              rows={11}
              disabled={modalProps.actionType === 'view'}
              onChange={(e) => handleInputChange('abstract', e.target.value)}
              defaultValue={modalProps.actionType === 'new' ? '' : modalProps.paper.abstract}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="comments-field"
              label="Comments"
              placeholder="Enter optional comments"
              fullWidth
              margin="normal"
              multiline
              rows={8}
              disabled={modalProps.actionType === 'view'}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              defaultValue={modalProps.actionType === 'new' ? '' : modalProps.paper.comments}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        {modalProps.actionType !== 'view' ? (
          <Button
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            className={classes.headerButton}
            onClick={() => actionModalHandler(modalProps.actionType, innerPaper)}
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
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

PaperModal.propTypes = {
  modalProps: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    paper: PropTypes.shape({
      id: PropTypes.string,
      doi: PropTypes.string,
      name: PropTypes.string,
      authors: PropTypes.string,
      abstract: PropTypes.string,
      journal: PropTypes.string,
      paper_type: PropTypes.string,
      added_by: PropTypes.string,
      updated_by: PropTypes.string,
      status: PropTypes.number,
      comments: PropTypes.string,
      architectures: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
        }),
      )
    }),
    actionType: PropTypes.string.isRequired
  }).isRequired,
  setModalProps: PropTypes.func.isRequired,
  actionModalHandler: PropTypes.func.isRequired
};
