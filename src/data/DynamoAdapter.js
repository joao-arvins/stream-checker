'use strict';

const AWS = require('aws-sdk'); 
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const addStreamRecord = (streamRecord) => {
    const streamInfo = {
        TableName: process.env.STREAMS_TABLE,
        Item: streamRecord
      };
      
      return dynamoDb.put(streamInfo).promise()
        .then(res => streamRecord);
}

module.exports = {
    addStreamRecord
};