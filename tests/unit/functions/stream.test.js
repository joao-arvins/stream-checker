const { add } = require('../../../src/functions/stream');
const testPayload = require('../../testPayload.json');
const streamRecordService = require('../../../src/services/streamRecordService');

describe('Adding a new record stream', () => {
    let output, addRecordSpy, callback;

    beforeEach(() => {
        callback = jest.fn();
        addRecordSpy = spyOn(streamRecordService, 'addRecord');
    });

    describe('When the record is successfully added', () => {
        beforeEach(async () => {
            await add(testPayload, {}, callback);
            output = callback.mock.calls[0][1];
        });

        it('A 200 response code is returned', () => {
            expect(output.statusCode).toEqual(201);
        });
    });

    describe('When adding a record fails', () => {
        beforeEach(async () => {
            addRecordSpy.and.callFake(() => {
                throw new Error();
            });
            
            await add(testPayload, {}, callback);
            output = callback.mock.calls[0][1];
        });

        it('A 500 response code is returned', () => {
            expect(output.statusCode).toEqual(500);
        });
    });
});
