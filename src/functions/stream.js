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
    const record = await streamRecordService.addRecord(body.userId, body.streamId);
    
    let message = `Adding stream record for user ${body.userId} and stream ${body.streamId}. 
      Result: ${record ? `Added: ${record.id}` : 'No record was created'}`;
      
    log.info(message, body);

    callback(null, {
      statusCode: record ? 201 : 403,
      body: JSON.stringify(record)
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
