'use strict';

const AWS = require('aws-sdk'); 
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getNumberOfActiveStreamsByUser = (userId) => {
    const params = {
        TableName: process.env.STREAMS_TABLE,
        FilterExpression:"userId = :userId",
        ExpressionAttributeValues: {
            ":userId":userId
        },
        Select:'COUNT'
    };

    return dynamoDb.scan(params)
        .promise()
        .then(res => res.Count);
}

const addStreamRecord = (streamRecord) => {
    const params = {
        TableName: process.env.STREAMS_TABLE,
        Item: streamRecord
    };
      
      return dynamoDb.put(params)
        .promise()
        .then(res => true);
}

module.exports = {
    addStreamRecord,
    getNumberOfActiveStreamsByUser
};