module.exports = {
  parseDBResults: res => {
      if(res["rows"]) {
          return {
              success: true,
              result: res["rows"]
          }
      }
      else {
          return {
              success: false,
              errorMsg: "Failed connexion to DB" + JSON.stringify(res)
          }
      }
  },
  intErrResp: () => {
      return {
          success: false,
          errorMsg: "An internal error occured. Please contact the developer in charge of the app and provide him information about this issue."
      }
  }
}