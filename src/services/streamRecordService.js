'use strict';

const StreamRecord = require('../models/StreamRecord');
const dbAdapter = require('../data/dynamoAdapter');

const addRecord = async (userId, streamId) => {
    let streamRecord = new StreamRecord(userId, streamId);
    let result = await dbAdapter.addStreamRecord(streamRecord);
    return result;
}

module.exports = {
    addRecord
};