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
  }
}