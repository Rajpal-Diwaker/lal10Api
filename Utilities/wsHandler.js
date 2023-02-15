const { Users } = require('../users');
const appChat = require('../dao/v2/appChat');

const { REDIS_CLIENT, GENERATE_REDIS_KEYS, SEPARATOR } = require('./constants');
const { getRedisKeys } = require('./redis');

const users = new Users();
global.users = users;
let windowList = [];

// global.onlineUsers = {};

// single tick (default)
// dbl tick (online)
// getMessage / same window (blue tick)
// fromId is sender socket Id

const deleteKeysWithPattern = async pattern => {
    const keysToRemove = await getRedisKeys(pattern);
    await Promise.all(keysToRemove.map(async key => await REDIS_CLIENT.del(key)))
    /*const multi = await REDIS_CLIENT.multi();
    keysToRemove.forEach(key => multi.del(key))
    try{
        await new Promise((resolve, reject) => multi.exec((err, resp) => {
            if(err){
                reject(err);
            } else {
                resolve();
            }
        }));
    } catch(err) {
        console.error(`Error in deleting keys from redis with pattern ${pattern}`);
        console.error(err);
    }*/

};

const getSocketIds = async pattern => {
    const connectedUserKeys = await getRedisKeys(pattern);
    return connectedUserKeys.map(key => key.split(SEPARATOR)[1]);
}

module.exports.onWsConnectionHandler =  async (io, socket) => {
    console.log("\x1b[31m", "Congratulation connection has been established");
    // console.log("\x1b[31m", io);

    io.clients((error, clients) => {
        if(error) console.log("error", error.toString());
        if(clients) console.log("clients: ", clients);
    })

    // const clients = await io.of('/').adapter.sockets();
    // console.log(`Connected client ids ${clients}`);

    // initilize the socket
    socket.on('online', async (data) => {
        console.log("\x1b[31m", "ONLINE");
        const windowKeyPattern = GENERATE_REDIS_KEYS.ENQUIRY_WINDOW_KEY(data.fromId, '*', '*')
        await deleteKeysWithPattern(windowKeyPattern);
        const connectedUserPattern = GENERATE_REDIS_KEYS.CONNECTED_USER_KEY(socket.id, '*');
        await deleteKeysWithPattern(connectedUserPattern);
        const onlineUserKey = GENERATE_REDIS_KEYS.CONNECTED_USER_KEY(socket.id, data.fromId);
        await REDIS_CLIENT.set(onlineUserKey, 1);

        console.log('----online--', users)

        await appChat.deliverdMessage(data);
        socket.broadcast.emit('readTik', { "result": 'Read'})
    });

    //log in
    socket.on('windowOn', async (data) => {
        console.log("windowOn press",data)
        const windowKeyPattern = GENERATE_REDIS_KEYS.ENQUIRY_WINDOW_KEY(data.fromId, data.toId, data.EnqId);
        await REDIS_CLIENT.del(windowKeyPattern);
        await REDIS_CLIENT.set(windowKeyPattern, 1)
        const windowsOnKeys = await getRedisKeys(GENERATE_REDIS_KEYS.ENQUIRY_WINDOW_KEY('*', '*', '*'));
        console.log('windows on keys');
        console.log(windowsOnKeys);
    })

    //log out
    socket.on('windowOff', async (data) => {
        console.log("windowOff press",data)
        const windowKeyToRemove = GENERATE_REDIS_KEYS.ENQUIRY_WINDOW_KEY(data.fromId, data.toId, data.EnqId);
        await REDIS_CLIENT.del(windowKeyToRemove);
        const allWindowKeys = await getRedisKeys(GENERATE_REDIS_KEYS.ENQUIRY_WINDOW_KEY('*', '*', '*'));

                console.log('WindowOff window list ');
                console.log(allWindowKeys);
                console.log('key deleted ' + windowKeyToRemove);
    })

    //  // //log out
    // socket.on('windowOff', async (data) => {
    //     const windowKeyToRemove = GENERATE_REDIS_KEYS.ENQUIRY_WINDOW_KEY(data.fromId, data.toId, data.EnqId);
    //     await REDIS_CLIENT.del(windowKeyToRemove);
    //     const allWindowKeys = await getRedisKeys(GENERATE_REDIS_KEYS.ENQUIRY_WINDOW_KEY('*', '*', '*'));
    //     // await deleteKeysWithPattern(GENERATE_REDIS_KEYS.CONNECTED_USER_KEY(data.toId, '*'));
    //     	console.log('WindowOff window list ');
    //         console.log(allWindowKeys);
    //         console.log('key deleted ' + windowKeyToRemove);
    //     })

    //log out
    socket.on('disconnect', async () => {
        console.log("a user disconnected, ", socket.id)
        const userKey = GENERATE_REDIS_KEYS.CONNECTED_USER_KEY(socket.id, '*');
        const key = await getRedisKeys(userKey);
        let room;
        if(key && key.length){
            room = key[0].split(SEPARATOR);
            room = room[room.length - 1];
            const windowKey = GENERATE_REDIS_KEYS.ENQUIRY_WINDOW_KEY(room, '*', '*');
            await deleteKeysWithPattern(windowKey);
            await REDIS_CLIENT.del(key[0]);
        }
    })

    // Sending a Message
    socket.on('sendMessage', async(data) => {
        // console.log('data', data)
        let { type } = data

        let isComment = [], isPrice = []

        if(type == 'comment'){

        }
        if(type == 'price'){

        }

        await appChat.sendChatMessage(data, async (err, dbData) => { // have to look if this insert part is working fine

            // console.log("err==",err)
            // console.log("dbData==",dbData,"dbData",data)

            if (err) {
                io.sockets.to(socket.id).emit('error_callback', { "message": "error occur." });
            }

            const receiverUserKey = GENERATE_REDIS_KEYS.CONNECTED_USER_KEY('*', data.toId);
            const senderUserKey = GENERATE_REDIS_KEYS.CONNECTED_USER_KEY('*', data.fromId);

            console.log(receiverUserKey);
            console.log(senderUserKey);

            /*const multi = await REDIS_CLIENT.multi();
            multi.get(receiverUserKey);
            multi.get(senderUserKey);
            let [receiver, sender] = new Promise((response, reject) => multi.exec((err, resp) => {
                if(err){
                    reject(err);
                } else {
                    resolve([resp[0], resp[1]]);
                }
            }));*/
            let [receiver, sender] = await Promise.all([getRedisKeys(receiverUserKey), getRedisKeys(senderUserKey)]);
            // console.log('\x1b[31m', 'receiver')
            // console.log(receiver);
            // console.log('\x1b[31m', 'sender');
            // console.log(sender);

	        receiver = receiver.length ? receiver[0] : null;
            sender = sender.length ? sender[0] : null;

            const receiverRoom = receiver ? receiver.split(SEPARATOR)[2] : null;
            const senderRoom = sender ? sender.split(SEPARATOR)[2] : null;
            const usersInSenderRoomKeysPattern = senderRoom ? GENERATE_REDIS_KEYS.CONNECTED_USER_KEY('*', senderRoom) : null;
            const usersInReceiverRoomKeyPattern = receiverRoom ? GENERATE_REDIS_KEYS.CONNECTED_USER_KEY('*', receiverRoom) : null;
            // let receiverRoom = users.getUser(data.toId);	//checking toUser is online or not
            // let senderRoom = users.getUser(data.fromId);

            console.log("receiverRoom==", receiverRoom)
            console.log("senderRoom==", senderRoom)

            let getRecentChatData = await appChat.getchatData(data); // last chat data // have to check the current state is well maintained or not
            getRecentChatData['isComment'] = 0
            getRecentChatData['isPrice'] = 0

            if (receiver) {

                ///////////////////// Checking Reciver on same windows or Not ///////////////////////////////////////

                const windowKeyPattern = GENERATE_REDIS_KEYS.ENQUIRY_WINDOW_KEY(data.toId, data.fromId, data.EnqId);
                let windowKey = await getRedisKeys(windowKeyPattern);
                windowKey = windowKey.length ? windowKey[0] : null;
                // const Windowdata = _.findWhere(windowList, { fromId: data.toId,toId: data.fromId, EnqId: data.EnqId });

                // console.log("Windowdata==",windowKey)


                if (windowKey) {
                    await appChat.readMessage({ fromId: data.fromId, EnqId: data.EnqId, toId: data.toId, isRead: 2 });
                    const socketIds = await getSocketIds(usersInReceiverRoomKeyPattern);
                    // const socketIds = users.users.filter(ob => ob.room == receiverRoom.room)
                    getRecentChatData.isRead='2'
                    if(isComment && isComment.length) {
                        getRecentChatData['isComment'] = 1
                    }
                    if(isPrice && isPrice.length) {
                        getRecentChatData['isPrice'] = 1
                    }

                    socketIds.forEach( sId =>
                        io.sockets.to(sId).emit('receiveMessage', { "result": getRecentChatData }));
                    /////////////////////Blue Tick Message ///////////////////////////////////////

                    if(sender) {

                        const socketIds = await getSocketIds(usersInSenderRoomKeysPattern);
                        // const socketIds = users.users.filter(ob => ob.room == senderRoom.room)

                        // console.log("socketIds==windowKey",socketIds)

                        socketIds.forEach( sId =>
                            io.sockets.to(sId).emit('receiveMessage', { "result": getRecentChatData }));
                    }

                }else{

                    console.log("receiverRoom==Windowdata OFFLINE",receiverRoom)
                    console.log("senderRoom",senderRoom)
                    // console.log("getRecentChatData",getRecentChatData)


                    /////////////////////Double Tick Message ///////////////////////////////////////

                    getRecentChatData.isRead= getRecentChatData.isRead==2? '2': '1'
                    // await appChat.readMessage({ fromId: data.fromId, EnqId: data.EnqId, toId: data.toId, isRead: getRecentChatData.isRead });
                    // console.log("sumittttttttttttttttttttttttttttttttttttttttttttttttttttttt",getRecentChatData)

                    await appChat.whennotscreenreadMessage({ fromId: data.fromId, EnqId: data.EnqId, toId: data.toId, isRead: getRecentChatData.isRead });

                    if(sender) {
                        const socketIds = await getSocketIds(usersInSenderRoomKeysPattern);
                        // const socketIds = users.users.filter(ob => ob.room == senderRoom.room)

                        socketIds.forEach( sId =>
                            io.sockets.to(sId).emit('receiveMessage', { "result": getRecentChatData }))
                    }
                    /////////////////////Sending a Enquiry and Order list Count ////////////////////


                    const checkEnquiry = await appChat.checkEnquiryorOrder(data);

                    // console.log("checkEnquiry==",checkEnquiry)

                    if(checkEnquiry){

                        const orderChat = {};
                        orderChat.EnqId = Number(data.EnqId);
                        orderChat.totalUnread = await appChat.getUnreadEnqCount(data,'order');
                        orderChat.totalCount = await appChat.getUnreadCount(data,'order');
                        orderChat.last_msg = data.msg;
                        orderChat.type = data.type;
                        orderChat.fromId = data.fromId;
                        orderChat.created_at = getRecentChatData.created_at3;

                        console.log("\x1b[31m", "orderChat",orderChat);
                        const socketIds = await getSocketIds(usersInSenderRoomKeysPattern);
                        console.log("socketIds",socketIds);
                        // const socketIds = users.users.filter(ob => ob.room == receiverRoom.room)

                        // socketIds.forEach( sId =>
                            // io.sockets.to(sId).emit('receiveOrderChat', { "result": orderChat }));
                            // socket.broadcast.emit('receiveOrderChat', { "result": orderChat }));
                        socket.broadcast.emit('receiveOrderChat', { "result": orderChat })
                        socket.broadcast.emit('receiveOrderListChat', { "result": orderChat })

                    }else{

                        const enquiryChat = {};
                        enquiryChat.EnqId = Number(data.EnqId);
                        enquiryChat.totalUnread = await appChat.getUnreadEnqCount(data,'enquiry');
                        enquiryChat.totalCount = await appChat.getUnreadCount(data,'enquiry');
                        enquiryChat.created_at = getRecentChatData.created_at3;
                        enquiryChat.last_msg = data.msg;
                        enquiryChat.type = data.type;
                        enquiryChat.fromId = data.fromId;

                        console.log("\x1b[31m", "enquiryChat",enquiryChat);
                        const socketIds = await getSocketIds(usersInSenderRoomKeysPattern);
                        // const socketIds = users.users.filter(ob => ob.room == receiverRoom.room)

                        // socketIds.forEach( sId =>
                        //     // io.sockets.to(sId).emit('receiveEnquiryChat', { "result": enquiryChat }));
                        //     socket.broadcast.emit('receiveEnquiryChat', { "result": enquiryChat }));

                        socket.broadcast.emit('receiveEnquiryChat', { "result": enquiryChat })
                        socket.broadcast.emit('receiveEnquiryListChat', { "result": enquiryChat })
                    }
                        await appChat.sendOfflineMsg(data);
                }
            } else {

                // console.log("\x1b[31m", "OFFLINE ==",getRecentChatData)
                // console.log("\x1b[31m", "OFFLINE ==data",data)
                const socketIds = await getSocketIds(usersInSenderRoomKeysPattern);
                // const socketIds = users.users.filter(ob => ob.room == senderRoom.room)

                socketIds.forEach( sId =>
                    io.sockets.to(sId).emit('receiveMessage', { "result": getRecentChatData }))

                /////////////////////user offline  ///////////////////////////////////////

                await appChat.sendOfflineMsg(data);
                // notify.SENDER_DATA(notiType,userData.device_id,userData.web_id, device_type, title, message,userData,acc_type,data.r_id,data.s_id)
                // notify.SENDER_DATA(notiType,userData.gcm_id,device_type,title,message,sendData,data.r_id,data.s_id)
            }
        })
    })

    socket.on('getMessage', async (data) => {
        // sender user data
        // await appChat.readMessage({ fromId: data.toId, EnqId: data.EnqId, toId: data.fromId, isRead: 2 });
        await appChat.readMessage2({ fromId: data.toId, EnqId: data.EnqId, toId: data.fromId, isRead: 2 });
        const dbData = await appChat.getMessage(data);

        // console.log("dbData",dbData)
        socket.emit('getMessage', { "result": dbData });

        /////////////////////Blue Tick Message ///////////////////////////////////////
        const receiver = await getRedisKeys(GENERATE_REDIS_KEYS.CONNECTED_USER_KEY(data.toId, '*'));
        // const receiverRoom = users.getUser(data.toId);

        if (receiver.length) {
            // const socketIds = users.users.filter(ob => ob.room == receiverRoom.room)

            // socketIds.forEach( ob => {
            // 	const { id } = ob
            socket.broadcast.emit('blueTik', { "result": 'Read', ...data });
            // io.sockets.to(receiverRoom.id).emit('blueTik', { "result": 'Read', ...data });
            //})
        }
    })

    /////////////////////No Need This event at time //////////////////////////////////
    socket.on('readMessage', async function (data) {
        // const dbData = await appChat.readMessage(data);  // sender user data
        // const SenderSocketId = _.findWhere(userList, { id: `${data.fromId}` });
        // io.sockets.to(SenderSocketId.socketId).emit('receiveMessage', { "result": 'Read' });
        // const ReciverSocketId = _.findWhere(userList, { id: `${data.toId}` });
        // if (ReciverSocketId)
        // 	io.sockets.to(ReciverSocketId.socketId).emit('blueTik', { "result": 'Read' });
    })

};

module.exports.getSocketIds = getSocketIds;
