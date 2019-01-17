'use strict';

const streamRecordService = require('../services/streamRecordService');
const log = require('../lib/logger');

module.exports.add = async (event, context, callback) => {
  let body = JSON.parse(event.body);

  if(typeof body.userId !== 'string' || typeof body.streamId !== 'string') {
    let invalidDataMessage = 'Invalid data. Payload must contain 2 required string fields: userId and streamId';
    log.error(invalidDataMessage, body);

    callback(null, {
      statusCode: 400
    });
    
    return;
  }

  try {
    const recordAdded = await streamRecordService.addRecord(body.userId, body.streamId);
    
    let message = `Adding stream record for user ${body.userId} and stream ${body.streamId}. 
      Result: ${recordAdded ? 'Added' : 'Not Added'}`;
      
    log.info(message, body);

    callback(null, {
      statusCode: recordAdded ? 201 : 403
    });
  }
  catch(e) {
    log.error('Internal Server Error', body, e);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify(e)
    });
  }
};
