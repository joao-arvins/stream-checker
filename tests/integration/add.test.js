const uuidv4 = require('uuid/v4');
const { add } = require('../../src/functions/stream');
const testPayload = require('../testPayload.json');
const AWS = require('aws-sdk'); 
const dynamoDb = new AWS.DynamoDB.DocumentClient();

describe('Adding a new record stream', () => {
    let output, callback, userId, payload;

    beforeEach(() => {
        callback = jest.fn();
    });

    describe('When the given user has no active streams', () => {
        beforeEach(async (done) => {
            testPayload.body = createBodyPayload();

            await add(testPayload, {}, callback);

            output = callback.mock.calls[0][1];

            deleteTestItems(callback.mock.calls, done);
        });

        it('The new stream record is created', () => {
            expect(output.statusCode).toEqual(201);
            expect(output.body).toBeDefined();
        });
    });

        describe('When the number of active streams is lower than the maximum', () => {
        beforeEach(async (done) => {
            testPayload.body = createBodyPayload();
            for (let index = 0; index <= process.env.MAX_STREAMS_COUNT - 1; index++) {
                await add(testPayload, {}, callback);
            }

            output = callback.mock.calls[process.env.MAX_STREAMS_COUNT - 1][1];

            deleteTestItems(callback.mock.calls, done);
        });

        it('The new stream record is created', () => {
            expect(output.statusCode).toEqual(201);
            expect(output.body).toBeDefined();
        });
    });

    describe('When the number of active streams equals the maximum amount', () => {
        beforeEach(async (done) => {
            testPayload.body = createBodyPayload();

            for (let index = 0; index <= process.env.MAX_STREAMS_COUNT; index++) {
                await add(testPayload, {}, callback);
            }

            output = callback.mock.calls[process.env.MAX_STREAMS_COUNT][1];

            deleteTestItems(callback.mock.calls, done);
        });

        it('The new stream record is NOT created', () => {
            expect(output.statusCode).toEqual(403);
            expect(output.body).toBeUndefined();
        });
    });
});

const createBodyPayload = () => {
    let userId = uuidv4();
    return `{\"userId\" : \"${userId}\", \"streamId\" : \"1\"}`;
};

//Deletes all items created during tests
const deleteTestItems = (calls, callback) => {
    const params = {
        RequestItems: {
          [process.env.STREAMS_TABLE]: []
        }
    };

    params.RequestItems[process.env.STREAMS_TABLE] = calls
        .filter(call => call[1].body)
        .map(call => {
            let newItemId = JSON.parse(call[1].body).id;
            return {
                DeleteRequest: {
                  Key: { id: newItemId }
                }
            };
        });

    dynamoDb.batchWrite(params)
        .promise()
        .then(res => {
            callback();
        });
}