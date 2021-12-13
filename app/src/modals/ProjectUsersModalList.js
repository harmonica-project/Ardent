import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Paper,
  Checkbox,
  IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {
  getUsersBySubstring as getUsersBySubstringRequest,
  getUsers as getUsersRequest
} from 'src/requests/users';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles({
  container: {
    maxHeight: 440,
    width: '100%',
  },
});

const ProjectUsersModalList = ({
  users, handleInputChange
}) => {
  const classes = useStyles();
  const [formUser, setFormUser] = useState({
    username: '',
    is_admin: false
  });
  const [errorUsername, setErrorUsername] = useState(false);
  const [matchingUNames, setMatchingUNames] = useState([]);

  const validateAndChange = () => {
    if (formUser.username.length) {
      handleInputChange('user', formUser, 'add');
      setFormUser({ username: '', is_admin: false });
    } else {
      setErrorUsername(true);
    }
  };

  const changeAutocomplete = (letters) => {
    const getUsersFco = (letters.length ? getUsersBySubstringRequest : getUsersRequest);
    getUsersFco(letters)
      .then((data) => {
        if (data.success) {
          setMatchingUNames(data.result);
        }
      });
  };

  useEffect(() => {
    getUsersRequest()
      .then((data) => {
        if (data.success) {
          setMatchingUNames(data.result);
        }
      });
  }, []);

  return (
    <TableContainer className={classes.container} component={Paper}>
      <Table aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell
              align="center"
            >
              Username
            </TableCell>
            <TableCell
              align="center"
            >
              Admin
            </TableCell>
            <TableCell
              align="center"
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row) => {
            return (
              <TableRow role="checkbox" tabIndex={-1} key={`row-category-${row.id}`}>
                <TableCell key={`cell-category-${row.id}`} style={{ textAlign: 'center' }}>
                  {row.username}
                </TableCell>
                <TableCell key={`cell-category-${row.id}`} style={{ textAlign: 'center' }}>
                  <Checkbox
                    checked={row.is_admin}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    onClick={() => handleInputChange('user', row, 'modify')}
                    disabled={row.locked}
                  />
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <IconButton aria-label="delete" disabled={row.locked}>
                    <CloseIcon
                      onClick={() => handleInputChange('user', row, 'delete')}
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow role="checkbox" tabIndex={-1} key="row-user-new">
            <TableCell key="cell-username-new" style={{ textAlign: 'center' }}>
              <Autocomplete
                id="new-username-input"
                options={matchingUNames.sort((a, b) => -b.username[0].localeCompare(a.username[0]))}
                groupBy={(option) => option.username[0]}
                getOptionLabel={(option) => option.username}
                renderInput={(params) => <TextField {...params} label="Type username ..." onChange={(e) => changeAutocomplete(e.target.value)} />}
                value={formUser}
                error={errorUsername}
                onChange={(_, newValue) => {
                  if (newValue) {
                    setFormUser({ ...formUser, username: newValue.username });
                    setErrorUsername(false);
                  }
                }}
                fullWidth
              />
            </TableCell>
            <TableCell key="cell-isadmin-new" style={{ textAlign: 'center' }}>
              <Checkbox
                checked={formUser.is_admin}
                onChange={() => setFormUser({ ...formUser, is_admin: !formUser.is_admin })}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </TableCell>
            <TableCell key="cell-validate-new" style={{ textAlign: 'center' }}>
              <Button
                onClick={validateAndChange}
                variant="contained"
              >
                Add user
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ProjectUsersModalList.propTypes = {
  users: PropTypes.array,
  handleInputChange: PropTypes.func
};

export default ProjectUsersModalList;
