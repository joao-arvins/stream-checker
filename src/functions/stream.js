'use strict';

const streamRecordService = require('../services/streamRecordService');
const log = require('../lib/logger');

module.exports.add = async (event, context, callback) => {
  let { userId, streamId } = JSON.parse(event.body);

  if(typeof userId !== 'string' || typeof streamId !== 'string') {
    let invalidDataMessage = 'Invalid data. Payload must contain 2 required string fields: userId and streamId';
    log.error(invalidDataMessage, { userId, streamId });

    callback(null, {
      statusCode: 400,
      message: 'Invalid data. Payload must contain 2 required string fields: userId and streamId'
    });
    return;
  }

  try {
    const recordAdded = await streamRecordService.addRecord(userId, streamId);
    
    let message = `Adding stream record for user ${userId} and stream ${streamId}. 
      Result: ${recordAdded ? 'Added' : 'Not Added'}`;
      
    log.info(message, { userId, streamId });

    callback(null, {
      statusCode: recordAdded ? 201 : 403
    });
  }
  catch(e) {
    log.error('Internal Server Error', { userId, streamId }, e);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify(e)
    });
  }
};
