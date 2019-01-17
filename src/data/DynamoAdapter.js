'use strict';

const AWS = require('aws-sdk'); 
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getNumberOfActiveStreamsByUser = (userId) => {
    return 1;
}

const addStreamRecord = (streamRecord) => {
    const streamInfo = {
        TableName: process.env.STREAMS_TABLE,
        Item: streamRecord
      };
      
      return dynamoDb.put(streamInfo)
        .promise()
        .then(res => true);
}

module.exports = {
    addStreamRecord,
    getNumberOfActiveStreamsByUser
};