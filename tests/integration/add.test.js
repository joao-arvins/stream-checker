const uuidv4 = require('uuid/v4');
const { add } = require('../../src/functions/stream');
const testPayload = require('../testPayload.json');

describe('Adding a new record stream', () => {
    let output, callback, userId, payload;

    afterAll(() => {
        //TODO: Delete created items
    });

    beforeEach(() => {
        callback = jest.fn();
    });

    describe('When the given user has no active streams', () => {
        beforeEach(async () => {
            let userId = uuidv4();
            testPayload.body = `{\"userId\" : \"${userId}\", \"streamId\" : \"1\"}`;

            await add(testPayload, {}, callback);

            output = callback.mock.calls[0][1];
        });

        it('The new stream record is created', () => {
            expect(output.statusCode).toEqual(201);
        });
    });

    describe('When the number of active streams is lower than the maximum', () => {
        beforeEach(async () => {
            let userId = uuidv4();
            testPayload.body = `{\"userId\" : \"${userId}\", \"streamId\" : \"1\"}`;

            for (let index = 0; index <= process.env.MAX_STREAMS_COUNT - 1; index++) {
                await add(testPayload, {}, callback);
            }

            output = callback.mock.calls[process.env.MAX_STREAMS_COUNT - 1][1];
        });

        it('The new stream record is created', () => {
            expect(output.statusCode).toEqual(201);
        });
    });

    describe('When the number of active streams equals the maximum amount', () => {
        beforeEach(async () => {
            let userId = uuidv4();
            testPayload.body = `{\"userId\" : \"${userId}\", \"streamId\" : \"1\"}`;

            for (let index = 0; index <= process.env.MAX_STREAMS_COUNT; index++) {
                await add(testPayload, {}, callback);
            }

            output = callback.mock.calls[process.env.MAX_STREAMS_COUNT][1];
        });

        it('The new stream record is NOT created', () => {
            expect(output.statusCode).toEqual(403);
        });
    });
});
