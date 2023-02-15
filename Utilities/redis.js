const {promisify} = require('util');

const {REDIS_METHODS, REDIS_CLIENT} = require('./constants');


async function getRedisKeys(pattern){
    return await REDIS_CLIENT.keys(pattern);
}

const promisifyRedisClient = (handle, client) => {
    REDIS_METHODS.forEach(method => {
        handle[method] = promisify(client[method]).bind(client);
    });
};

module.exports = {getRedisKeys, promisifyRedisClient};