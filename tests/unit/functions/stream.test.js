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
            addRecordSpy.and.returnValue(true);
            await add(testPayload, {}, callback);
            output = callback.mock.calls[0][1];
        });

        it('A 201 - CREATED response code is returned', () => {
            expect(output.statusCode).toEqual(201);
        });
    });

    describe('When the record is not added', () => {
        beforeEach(async () => {
            addRecordSpy.and.returnValue(false);
            await add(testPayload, {}, callback);
            output = callback.mock.calls[0][1];
        });

        it('A 403 - Forbidden response code is returned', () => {
            expect(output.statusCode).toEqual(403);
        });
    });

    describe('When an error is thrown', () => {
        beforeEach(async () => {
            addRecordSpy.and.callFake(() => {
                throw new Error();
            });
            
            await add(testPayload, {}, callback);
            output = callback.mock.calls[0][1];
        });

        it('A 500 - Internal Server error response code is returned', () => {
            expect(output.statusCode).toEqual(500);
        });
    });

    describe('When the request body is invalid', () => {
        beforeEach(async () => {           
            let body = JSON.stringify({ streamId : 1, userId: "test" });  
            await add({ body }, {}, callback);
            output = callback.mock.calls[0][1];
        });

        it('No request to create a stream record is performed', () => {
            expect(addRecordSpy).not.toHaveBeenCalled();
        });

        it('A 400 - Bad request response code is returned', () => {
            expect(output.statusCode).toEqual(400);
        });
    });
});
