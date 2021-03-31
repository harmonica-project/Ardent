import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  makeStyles,
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import {
  Delete as DeleteIcon
} from '@material-ui/icons/';
import Page from 'src/components/Page';
import PropTypes from 'prop-types';
import {
  getArchitecture,
  deleteArchitecture as deleteArchitectureRequest,
  saveExistingArchitecture as saveExistingArchitectureRequest
} from 'src/requests/architecture';
import MessageSnackbar from 'src/components/MessageSnackbar';
import handleErrorRequest from 'src/utils/handleErrorRequest';
import AppBreadcrumb from 'src/components/AppBreadcrumb';
import ArchitectureModal from '../../papers/PaperListView/ArchitectureModal';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  architectureSubtitle: {
    marginBottom: theme.spacing(3),
    color: 'grey'
  }
}));

const ArchitectureView = () => {
  const classes = useStyles();
  const { id } = useParams();
  const navigate = useNavigate();

  const [architecture, setArchitecture] = useState({ components: [] });
  const [architectureModalProps, setArchitectureModalProps] = useState({
    open: false,
    architecture: { components: [] },
    actionType: ''
  });

  const [messageSnackbarProps, setMessageSnackbarProps] = useState({
    open: false,
    message: '',
    duration: 0,
    severity: 'information'
  });

  const displayMsg = (message, severity = 'success', duration = 6000) => {
    setMessageSnackbarProps({
      open: true,
      severity,
      duration,
      message
    });
  };

  useEffect(() => {
    getArchitecture(id)
      .then(({ data }) => {
        if (data.success) {
          setArchitecture(data.result);
          setArchitectureModalProps({
            ...architectureModalProps,
            architecture: data.result
          });
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg));
  }, []);

  const saveExistingArchitecture = (newArchitecture) => {
    saveExistingArchitectureRequest(newArchitecture)
      .then(({ data }) => {
        if (data.success) {
          setArchitectureModalProps({
            ...architectureModalProps,
            open: false,
            actionType: ''
          });
          setArchitecture(newArchitecture);
          displayMsg('Architecture successfully modified.');
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg));
  };

  const deleteArchitecture = async (architectureId) => {
    deleteArchitectureRequest(architectureId)
      .then(({ data }) => {
        if (data.success) {
          displayMsg('Architecture successfully deleted.');
          navigate('/app/papers');
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg));
  };

  const architectureActionModalHandler = (actionType, newArchitecture) => {
    switch (actionType) {
      case 'delete':
        if (window.confirm('Architecture deletion is irreversible. Associated components and properties will also be deleted. Proceed?')) { deleteArchitecture(architectureModalProps.architecture.id); }
        break;

      case 'edit':
        saveExistingArchitecture(newArchitecture);
        break;

      default:
        console.error('No action were provided to the handler.');
    }
  };

  const architectureEditHandler = () => {
    setArchitectureModalProps({
      ...architectureModalProps,
      open: true,
      actionType: 'edit'
    });
  };

  const ArchitectureHeader = () => {
    return (
      <Card>
        <CardContent>
          <Box display="flex" className={classes.boxMargin}>
            <Box width="100%">
              <AppBreadcrumb
                paperId={architecture.paper_id}
                architectureId={architecture.id}
              />
              <Typography variant="h1">
                {architecture.name}
              </Typography>
              <Typography variant="subtitle1" className={classes.architectureSubtitle}>
                Architecture #
                {architecture.id}
              </Typography>
              <Typography variant="body1">
                Reader description -&nbsp;
                {architecture.reader_description}
              </Typography>
              <Typography variant="body1">
                Author description -&nbsp;
                {architecture.author_description}
              </Typography>
            </Box>
            <Box flexShrink={0}>
              <Button
                color="primary"
                variant="contained"
                onClick={architectureEditHandler}
              >
                Edit
              </Button>
            </Box>
            &nbsp;
            <Box flexShrink={0}>
              <Button
                variant="contained"
                style={{ backgroundColor: '#f50057', color: 'white' }}
                startIcon={<DeleteIcon />}
                onClick={() => {
                  if (window.confirm('Architecture deletion is irreversible. Associated components and properties will also be deleted. Proceed?')) {
                    deleteArchitecture(architecture.id);
                  }
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const ComponentTable = ({ components }) => {
    const columns = [
      { field: 'name', headerName: 'Name', width: 300 },
      { field: 'reader_description', headerName: 'Reader description', width: 700 },
    ];

    const displayComponentsTable = () => {
      return (
        <div style={{ width: '100%' }}>
          <DataGrid rows={components} columns={columns} pageSize={10} autoHeight />
        </div>
      );
    };

    return (
      <Card>
        <CardContent>
          {
              components && components.length
                ? displayComponentsTable()
                : (
                  <Typography variant="h2">
                    No components yet.
                  </Typography>
                )
            }
        </CardContent>
      </Card>
    );
  };

  ComponentTable.propTypes = {
    components: PropTypes.array
  };

  return (
    <Page
      className={classes.root}
      title="Architecture"
    >
      <Container maxWidth={false}>
        <ArchitectureHeader />
        <br />
        <ComponentTable components={architecture.components} />
      </Container>
      <MessageSnackbar
        messageSnackbarProps={messageSnackbarProps}
        setMessageSnackbarProps={setMessageSnackbarProps}
      />
      <ArchitectureModal
        modalProps={architectureModalProps}
        setModalProps={setArchitectureModalProps}
        actionModalHandler={architectureActionModalHandler}
        doNotShowSwitch
      />
    </Page>
  );
};

export default ArchitectureView;
