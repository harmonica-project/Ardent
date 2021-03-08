import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import Page from 'src/components/Page';
import PropTypes from 'prop-types';
import {
  getArchitecture
} from 'src/requests/architecture';
import MessageSnackbar from 'src/components/MessageSnackbar';
import handleErrorRequest from 'src/utils/handleErrorRequest';
import AppBreadcrumb from 'src/components/AppBreadcrumb';

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

  const [architecture, setArchitecture] = useState({ components: [] });

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
        }
      })
      .catch((error) => handleErrorRequest(error, displayMsg));
  }, []);

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
                Description -&nbsp;
                {architecture.description}
              </Typography>
            </Box>
            <Box flexShrink={0}>
              <Button
                color="primary"
                variant="contained"
              >
                Edit
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
      { field: 'description', headerName: 'Description', width: 700 },
    ];

    console.log(components);

    const displayComponentsTable = () => {
      return (
        <Card>
          <CardContent>
            <div style={{ width: '100%' }}>
              <DataGrid rows={components} columns={columns} pageSize={10} autoHeight />
            </div>
          </CardContent>
        </Card>
      );
    };

    console.log(components);
    if (components && components.length) return displayComponentsTable();
    return (
      <Card>
        <CardContent>
          <Typography variant="h2">
            No components yet.
          </Typography>
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
    </Page>
  );
};

export default ArchitectureView;
