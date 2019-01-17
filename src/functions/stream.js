'use strict';

const streamRecordService = require('../services/streamRecordService');

module.exports.add = async (event, context, callback) => {
  let { userId, streamId } = JSON.parse(event.body);
  try {
    const addRecordResult = await streamRecordService.addRecord(userId, streamId);
    const response = {
      statusCode: 201,
      body: JSON.stringify(addRecordResult),
    };
    callback(null, response);
  }
  catch(e) {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify(e)
    });
  }
};
