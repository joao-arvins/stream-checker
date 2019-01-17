'use strict';

const log = (level, message, params, error) => {
  let logMsg = {
      level,
      message,
      params
  };

  if(error) {
      logMsg.error = error;
  }

  console.log(JSON.stringify(logMsg));
}

module.exports = {
    info: (message, params) => log('INFO',  message, params),
    error: (message, params, error) => log('ERROR',  message, params, error)
}