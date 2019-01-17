const streamRecordService = require('../../../src/services/streamRecordService');
const dbAdapter = require('../../../src/data/dynamoAdapter');

describe('Adding a new record stream', () => {
    let activeStreamsCountSpy, addRecordResult;

    beforeAll(() => {
        process.env.MAX_STREAMS_COUNT = 3;
    });

    beforeEach(() => {
        spyOn(dbAdapter, 'addStreamRecord').and.returnValue(true);
        activeStreamsCountSpy = spyOn(dbAdapter, 'getNumberOfActiveStreamsByUser');
    });

    describe('When the number of active streams is lower than the maximum', () => {
        beforeEach(async () => {
            activeStreamsCountSpy.and.returnValue(process.env.MAX_STREAMS_COUNT - 1);
            addRecordResult = await streamRecordService.addRecord("1", "1");
        });

        it('A request to create a new stream record is made', () => {
            expect(dbAdapter.addStreamRecord).toHaveBeenCalled();
        });
    });

    describe('When the number of active streams matches the maximum', () => {
        beforeEach(async () => {
            activeStreamsCountSpy.and.returnValue(process.env.MAX_STREAMS_COUNT);
            addRecordResult = await streamRecordService.addRecord("1", "1");
        });

        it('No request to create a stream record is made', () => {
            expect(dbAdapter.addStreamRecord).not.toHaveBeenCalled();
        });

        it('Returns false', () => {
            expect(addRecordResult).toBeFalsy();
        });
    });

    describe('When the number of active streams is greater than the maximum', () => {
        beforeEach(async () => {
            activeStreamsCountSpy.and.returnValue(process.env.MAX_STREAMS_COUNT + 1);
            addRecordResult = await streamRecordService.addRecord("1", "1");
        });

        it('No request to create a stream record is made', () => {
            expect(dbAdapter.addStreamRecord).not.toHaveBeenCalled();
        });

        it('Returns false', () => {
            expect(addRecordResult).toBeFalsy();
        });
    });
});
