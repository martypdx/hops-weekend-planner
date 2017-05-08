const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('hops api', () => {

    before(db.drop);

    it('initial /GET returns empty list', () => {
        return request
            .get('/users')
            .then(res => {
                const users = res.body;
                assert.deepEqual(users, []);
            });

    });
});