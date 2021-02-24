export default (error, displayMsg) => {
  if (!error.response) displayMsg(`An unexpected error occured in the app: ${error}`, 'error');
  else {
    switch (error.response.status) {
      case 401:
        displayMsg('You are not authorized to perform this request. Please reload your app and login again.', 'error');
        break;

      case 500:
        displayMsg(`An error occured while processing your request on server-side: ${error.response.data.errorMsg}`, 'error');
        break;

      default:
        displayMsg(`An unexpected error occured while processing your request: ${error.response.data.errorMsg}`, 'error');
    }
  }
};
