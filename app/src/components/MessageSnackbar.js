import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const MessageSnackbar = ({ messageSnackbarProps, setMessageSnackbarProps }) => {
  const classes = useStyles();

  const handleClose = () => {
    setMessageSnackbarProps({
      ...messageSnackbarProps,
      open: false
    });
  };

  return (
    <div className={classes.root}>
      <Snackbar
        open={messageSnackbarProps.open}
        autoHideDuration={messageSnackbarProps.duration ? messageSnackbarProps.duration : 6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={messageSnackbarProps.severity ? messageSnackbarProps.severity : 'information'}
        >
          {messageSnackbarProps.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MessageSnackbar;

MessageSnackbar.propTypes = {
  messageSnackbarProps: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    severity: PropTypes.string.isRequired
  }).isRequired,
  setMessageSnackbarProps: PropTypes.func.isRequired
};
