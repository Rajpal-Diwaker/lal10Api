const express = require('express'),
	app = express(),
	server = require('http').Server(app),
	path = require("path"),

	// v2 api start
	userRoute2 = require('./Routes/v2/user'),
	artisanRoute2 = require('./Routes/v2/artisan'),
	productRoute2 = require('./Routes/v2/product'),
	adminRoute2 = require('./Routes/v2/adminRoutes'),
	shopRoute2 = require('./Routes/v2/shop'),
	masterRoute2 = require('./Routes/v2/master'),
	appRoute2 = require('./Routes/v2/appRoutes'),
	webRoute2 = require('./Routes/v2/webRoutes'),
	crudRoute2 = require('./Routes/v2/crud'),
	appChat = require('./dao/v2/appChat');

	bodyParser = require('body-parser'),
	httpLogger = require('./logger/httpLogger'),
	util = require("./Utilities/util"),
	swaggerJSDoc = require('swagger-jsdoc'),
	swaggerUi = require('swagger-ui-express'),
	require('dotenv').config(),
	cors = require('cors');
	const fs = require("fs");

let timeout = require('connect-timeout');
const _ = require('underscore');

const morgan = require('morgan');
app.use(morgan('dev'))

const io = require('socket.io')(server);

app.use(cors());
app.disable("X-Powered-By")

app.use("/lal10admin", express.static(path.resolve(__dirname, '../lal10admin')));

app.get('/lal10admin',(req, res) => {
	const pth = path.resolve(__dirname, '../lal10admin')
	res.sendFile(`${pth}/index.html`);
})

app.use("/lal10website", express.static(path.resolve(__dirname, '../lal10website')));

app.get('/lal10website',(req, res) => {
	const pth = path.resolve(__dirname, '../lal10website')
	res.sendFile(`${pth}/index.html`);
})

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb',extended: true}));

app.use( (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, noauth, Authorization, authorization");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next()
});

app.get('/makePassword', async (req, res) => {
	const bcrypt = require('bcrypt')
	const newHash = await bcrypt.hash(req.query.pass, util.saltRounds());
	console.log(newHash)
})

const swaggerDefinition = {
	info: {
		title: 'Lal10 API Docs',
		version: '2.0.0',
		description: 'End points to test constious routes'
	},
	host: process.env.STAGING_SWAGGER_URL,
	basePath: '/',

	"securityDefinitions": {
		"api_key": {
		  "type": "apiKey",
		  "name": "authorization",
		  "in": "headers"
		}
	  },
	  "security": [
		{
		  "api_key": []
		}
	  ]
}

const options1 = {
	swaggerDefinition,
	apis: ['./Routes/v1/*.js']
}

const options2 = {
	swaggerDefinition,
	apis: ['./Routes/v2/*.js']
}

app.get('/swagger.json', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec)
})

const swaggerSpec = swaggerJSDoc(options2)

app.use(express.static(path.join(__dirname, 'public/userpic')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(httpLogger);

// v2 api start
app.use('/api/v2/user', userRoute2);
app.use('/api/v2/artisan', artisanRoute2);
app.use('/api/v2/products', productRoute2);
app.use('/api/v2/shop', shopRoute2);
app.use('/api/v2/master', masterRoute2);
app.use('/api/v2/crud', crudRoute2);

app.use('/api/v2/admin', adminRoute2);
app.use('/api/v2/app', appRoute2);
app.use('/api/v2/web', webRoute2);


app.use((err, req, res, next) => {
	// console.log(err, "global handler")
	return res.status(util.statusCode.FOUR_ZERO_ZERO).send({ "errorCode": util.statusCode.FOUR_ZERO_ZERO, "errorMessage": util.statusMessage.SOMETHING_WENT_WRONG });
});

const PORT = process.env.PORT || 5656
// const PORT = process.env.PORT || 5578
server.listen(PORT, function (err) {
	console.log('Server running on port ', PORT);
})


///////////////////////// Socket code Start ////////////////////////

const { Users } = require('./users');

const users = new Users();
global.users = users;
let windowList = [];

// global.onlineUsers = {};

// single tick (default)
// dbl tick (online)
// getMessage / same window (blue tick)
// fromId is sender socket Id

io.sockets.on('connection', async (socket) => {
    // console.log("\x1b[31m", "Congratulation connection has been established");

	io.clients((error, clients) => {
		if(clients) console.log("clients: ", clients);
	})

	// initilize the socket
	socket.on('online', async (data) => {
		// console.log("\x1b[31m", "ONLINE");
		let Windowdata = _.findWhere(windowList, { fromId: data.fromId });

		if (Windowdata && Windowdata.fromId) {
			windowList = _.without(windowList, Windowdata);
		}

		//socket.join(data.fromId);
		users.removeUser(socket.id);
		users.addUser(socket.id, data.fromId);

		console.log('----online--', users)

		await appChat.deliverdMessage(data);
		socket.broadcast.emit('readTik', { "result": 'Read'})
	})

	//log in
	socket.on('windowOn', async (data) => {
		let Windowdata = _.findWhere(windowList, { fromId: data.fromId,toId: data.toId, EnqId: data.EnqId });

		if (Windowdata && Windowdata.fromId) {
			windowList = _.without(windowList, Windowdata);
		}

		let WindowUserData = {};

			WindowUserData.fromId = data.fromId;
			WindowUserData.toId = data.toId;
			WindowUserData.EnqId = data.EnqId;
			windowList.push(WindowUserData);

		console.log("\x1b[31m", "windowList ON");
		console.log('windowList', windowList)
	})

	//log out
	socket.on('windowOff', async (data) => {
		let Windowdata = _.findWhere(windowList, { fromId: data.fromId, toId: data.toId, EnqId: data.EnqId });

		if (Windowdata && Windowdata.fromId) {
			windowList = _.without(windowList, Windowdata);
		}

		console.log("\x1b[31m", "windowList OFF");
		console.log('windowList', windowList)
	})

	//log out
	socket.on('disconnect', () => {
		console.log("a user disconnected, ", socket.id)
		let RoomId = users.getUserId(socket.id); // correct
		let Windowdata = _.findWhere(windowList, { fromId: RoomId });

		console.log("\x1b[31m", "disconnect event call",Windowdata);

		if (Windowdata && Windowdata.fromId) {
			windowList = _.without(windowList, Windowdata);
		}

		console.log("\x1b[31m", "disconnect event call",windowList);
		users.removeUser(socket.id);
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

		appChat.sendChatMessage(data, async (err, dbData) => { // have to look if this insert part is working fine

			// console.log("err==",err)
			// console.log("dbData==",dbData)

			if (err) {
				io.sockets.to(socket.id).emit('error_callback', { "message": "error occur." });
			}

			let receiverRoom = users.getUser(data.toId);	//checking toUser is online or not
			let senderRoom = users.getUser(data.fromId);

			// console.log("receiverRoom==", receiverRoom)
			// console.log("senderRoom==", senderRoom)

			let getRecentChatData = await appChat.getchatData(data); // last chat data // have to check the current state is well maintained or not
			getRecentChatData['isComment'] = 0
			getRecentChatData['isPrice'] = 0

			if (receiverRoom && receiverRoom.id) {

				///////////////////// Checking Reciver on same windows or Not ///////////////////////////////////////

				const Windowdata = _.findWhere(windowList, { fromId: data.toId,toId: data.fromId, EnqId: data.EnqId });

				// console.log("Windowdata==",Windowdata,Array.isArray(Windowdata))


				if (Windowdata && Windowdata.fromId) {

					await appChat.readMessage({ fromId: data.fromId, EnqId: data.EnqId, toId: data.toId, isRead: 2 });

					const socketIds = users.users.filter(ob => ob.room == receiverRoom.room)
					getRecentChatData.isRead='2'
					if(isComment && isComment.length) {
						getRecentChatData['isComment'] = 1
					}
					if(isPrice && isPrice.length) {
						getRecentChatData['isPrice'] = 1
					}
					socketIds.forEach( ob => {
						const { id } = ob

						io.sockets.to(id).emit('receiveMessage', { "result": getRecentChatData });
					})
					/////////////////////Blue Tick Message ///////////////////////////////////////

					if(senderRoom && senderRoom.id) {
						const socketIds = users.users.filter(ob => ob.room == senderRoom.room)

						socketIds.forEach( ob => {
							const { id } = ob

							io.sockets.to(id).emit('receiveMessage', { "result": getRecentChatData });
						})
					}

				}else{
					// console.log("receiverRoom==Windowdata",receiverRoom)
					// console.log("senderRoom",senderRoom)
					// console.log("getRecentChatData",getRecentChatData)


					/////////////////////Double Tick Message ///////////////////////////////////////

					getRecentChatData.isRead= getRecentChatData.isRead==2? '2': '1'
					// await appChat.readMessage({ fromId: data.fromId, EnqId: data.EnqId, toId: data.toId, isRead: getRecentChatData.isRead });
					// console.log("sumittttttttttttttttttttttttttttttttttttttttttttttttttttttt",getRecentChatData)

					await appChat.whennotscreenreadMessage({ fromId: data.fromId, EnqId: data.EnqId, toId: data.toId, isRead: getRecentChatData.isRead });

					if(senderRoom && senderRoom.id) {
						const socketIds = users.users.filter(ob => ob.room == senderRoom.room)

						socketIds.forEach( ob => {
							const { id } = ob

							io.sockets.to(id).emit('receiveMessage', { "result": getRecentChatData });
						})
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

						// console.log("\x1b[31m", "orderChat",orderChat);
						const socketIds = users.users.filter(ob => ob.room == receiverRoom.room)

						socketIds.forEach( ob => {
							const { id } = ob

							io.sockets.to(id).emit('receiveOrderChat', { "result": orderChat });
						})
						//io.to(receiverRoom.id).emit('receiveOrderChat',{ "result": orderChat });

					}else{

						const enquiryChat = {};
						enquiryChat.EnqId = Number(data.EnqId);
						enquiryChat.totalUnread = await appChat.getUnreadEnqCount(data,'enquiry');
						enquiryChat.totalCount = await appChat.getUnreadCount(data,'enquiry');
						enquiryChat.created_at = getRecentChatData.created_at3;
						enquiryChat.last_msg = data.msg;
						enquiryChat.type = data.type;
						enquiryChat.fromId = data.fromId;

						// console.log("\x1b[31m", "enquiryChat",enquiryChat);

						const socketIds = users.users.filter(ob => ob.room == receiverRoom.room)

						socketIds.forEach( ob => {
							const { id } = ob

							io.sockets.to(id).emit('receiveEnquiryChat', { "result": enquiryChat });
						})

						//io.to(receiverRoom.id).emit('receiveEnquiryChat',{ "result": enquiryChat });
					}
				}
			} else {

				// console.log("\x1b[31m", "OFFLINE ==",getRecentChatData)
				const socketIds = users.users.filter(ob => ob.room == senderRoom.room)

						socketIds.forEach( ob => {
							const { id } = ob

							io.sockets.to(id).emit('receiveMessage', { "result": getRecentChatData });
						})

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
		const receiverRoom = users.getUser(data.toId);

		if (receiverRoom && receiverRoom.id) {
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

});



///////////////////////// Socket code END ////////////////////////

// online Request {"fromId":"2"}
// sendMessage Request {"EnqId":"1","fromId":"3","toId":"2", "msg":"lest","files":"1573095501rd.png","type":"image,video,text" }
// online
// sendMessage
// receiveMessage
// disconnect
// readMessage

// sample
// {
// 	"EnqId":"1",
// 	"fromId":"1",
// 	"toId":"13",
// 	"msg":"sdbhsbadjstext",
// 	"files":"jasbdjbsdtext.jpg",
// 	"type":"text"
// }

// DB_NAME=lal10_db
// DB_HOST=root
// DB_PASSWORD=-Nzym.A2*
// SET GLOBAL time_zone = '+5:30'
// SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));


