'use strict';

const uuidv4 = require('uuid/v4');

module.exports = class StreamRecord {
    constructor(userId, streamId, active = true) {
        this.id = uuidv4();
        this.userId = userId;
        this.streamId = streamId;
        this.active = active;
    }
}