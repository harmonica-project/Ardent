import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import LoadingOverlay from 'src/components/LoadingOverlay';
import authenticationService from 'src/requests/authentication';
import { setUser as setUserRequest, setNewPassword as setNewPasswordRequest } from 'src/requests/users';
import {
  deleteCategory as deleteCategoryRequest,
  getCategories as getCategoriesRequest,
  saveCategory as saveCategoryRequest
} from 'src/requests/categories';
import ConfirmModal from 'src/modals/ConfirmModal';
import Password from './Password';
import Admin from './Admin';
import UserInfo from './UserInfo';
import Study from './Study';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const SettingsView = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [password, setPassword] = useState({
    password: '',
    confirm: ''
  });
  const [confirmModalProps, setConfirmModalProps] = useState({
    open: false,
    actionModalHandler: null,
    message: ''
  });

  const actionUserHandler = async () => {
    setOpen(true);
    try {
      const res = await setUserRequest(user);
      if (res) {
        enqueueSnackbar('Your profile has successfully been updated!', { variant: 'success' });
        authenticationService.updateUser(user);
      } else {
        enqueueSnackbar('Request failed.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(`Error: ${error.toString()}`, { variant: 'error' });
    } finally {
      setOpen(false);
    }
  };

  const actionPasswordHandler = async () => {
    setOpen(true);
    try {
      if (password.password === password.confirm) {
        const res = await setNewPasswordRequest({
          username: user.username,
          password: password.password
        });
        if (res) {
          enqueueSnackbar('Your password has successfully been updated!', { variant: 'success' });
        } else {
          enqueueSnackbar('Request failed.', { variant: 'error' });
        }
      } else {
        enqueueSnackbar('Password do not match.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(`Error: ${error.toString()}`, { variant: 'error' });
    } finally {
      setOpen(false);
    }
  };

  const removeCategoryFromState = (id) => {
    const newCategories = [...categories];
    for (let i = 0; i < newCategories.length; i++) {
      if (newCategories[i].id === id) {
        newCategories.splice(i, 1);
        setCategories(newCategories);
        return;
      }
    }
  };

  const deleteCategory = async (newCategory) => {
    setOpen(true);
    const deleteId = newCategory.id;
    try {
      if (deleteId) {
        const res = await deleteCategoryRequest(deleteId);
        if (res) {
          enqueueSnackbar('Category successfully deleted!', { variant: 'success' });
          removeCategoryFromState(deleteId);
        } else {
          enqueueSnackbar('Request failed.', { variant: 'error' });
        }
      } else {
        enqueueSnackbar('No category selected.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(`Error: ${error.toString()}`, { variant: 'error' });
    } finally {
      setOpen(false);
    }
  };

  const addCategory = async (newCategory) => {
    setOpen(true);
    const value = newCategory.label;
    try {
      if (value && value.length) {
        const res = await saveCategoryRequest(value);
        if (res) {
          enqueueSnackbar('Category successfully added!', { variant: 'success' });
          setCategories([
            ...categories,
            {
              label: value,
              id: res.categoryId
            }
          ]);
        } else {
          enqueueSnackbar('Request failed.', { variant: 'error' });
        }
      } else {
        enqueueSnackbar('No value specified.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(`Error: ${error.toString()}`, { variant: 'error' });
    } finally {
      setOpen(false);
    }
  };

  const categoryHandler = (actionType, newCategory) => {
    switch (actionType) {
      case 'new':
        addCategory(newCategory);
        break;

      case 'delete':
        setConfirmModalProps({
          open: true,
          message: 'Deleting a category will remove it from all concerned component. Confirm?',
          actionModalHandler: () => deleteCategory(newCategory)
        });
        break;

      default:
        console.error('No handler specified for this action.');
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategoriesRequest();
      if (data.success) {
        setCategories(data.result);
      }
    } catch (error) {
      enqueueSnackbar(error.toString(), 'error');
    }
  };

  useEffect(() => {
    const authInfo = authenticationService.currentUserValue;
    if (authInfo && authInfo.user) {
      setUser({
        ...authInfo.user,
        loaded: true
      });
    }

    fetchCategories();
  }, []);

  return (
    <Page
      className={classes.root}
      title="Settings"
    >
      <Container maxWidth="lg">
        <Box mb={3}>
          <Study
            categories={categories}
            actionHandler={categoryHandler}
          />
        </Box>
        {user.loaded ? (
          <UserInfo
            user={user}
            setUser={setUser}
            actionUserHandler={actionUserHandler}
          />
        ) : <div>Error</div>}
        <Box mt={3}>
          <Password
            password={password}
            setPassword={setPassword}
            actionPasswordHandler={actionPasswordHandler}
          />
        </Box>
        {user.is_admin ? (
          <Box mt={3}>
            <Admin />
          </Box>
        )
          : <div />}
      </Container>
      <LoadingOverlay open={open} />
      <ConfirmModal
        modalProps={confirmModalProps}
        setModalProps={setConfirmModalProps}
      />
    </Page>
  );
};

export default SettingsView;
