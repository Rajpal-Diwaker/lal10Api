const SEPARATOR = '__@@__'

module.exports.REDIS_METHODS = [
    'get', 'set', 'getset',
    'hdel', 'hexists', 'hget',
    'hgetall', 'hincrby', 'hincrbyfloat',
    'hkeys', 'hlen', 'hmget',
    'hmset', 'hset', 'incr',
    'incrby', 'incrbyfloat', 'keys',
    'mget', 'mset', 'select',
    'pexpire', 'persist', 'expire',
    'multi', 'exec', 'del',
    'sadd', 'smembers'
];

module.exports.GENERATE_REDIS_KEYS = {
    CONNECTED_USER_KEY: (sockId, room) =>
        `CONNECTED_USER${SEPARATOR}${sockId}${SEPARATOR}${room}`,
    ENQUIRY_WINDOW_KEY: (fromId, toId, enqId) => `ENQUIRY_WINDOW${SEPARATOR}${fromId}${SEPARATOR}${toId}${SEPARATOR}${enqId}`
};

module.exports.REDIS_DB = 3;

module.exports.SEPARATOR = SEPARATOR

module.exports.REDIS_CLIENT = {};

module.exports.CLIENT_TTL = 5000;

module.exports.IO_CONN = {io: null};
