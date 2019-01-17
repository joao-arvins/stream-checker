'use strict';

const StreamRecord = require('../models/StreamRecord');
const dbAdapter = require('../data/dynamoAdapter');

const addRecord = async (userId, streamId) => {
    let activeStreamCount = await dbAdapter.getNumberOfActiveStreamsByUser(userId);

    if(activeStreamCount >= process.env.MAX_STREAMS_COUNT) {
        return false;
    }

    let streamRecord = new StreamRecord(userId, streamId);
    await dbAdapter.addStreamRecord(streamRecord);
    return true;
}

module.exports = {
    addRecord
};