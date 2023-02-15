const express = require('express'),
	app = express(),
	server = require('http').Server(app),
	path = require("path"),

	// v1 api start
	userRoute1 = require('./Routes/v1/user'),
	artisanRoute1 = require('./Routes/v1/artisan'),
	productRoute1 = require('./Routes/v1/product'),
	adminRoute1 = require('./Routes/v1/admin'),
    shopRoute1 = require('./Routes/v1/shop'),
	masterRoute1 = require('./Routes/v1/master'),
	appRoute1 = require('./Routes/v1/appRoutes'),
	webRoute1 = require('./Routes/v1/webRoutes'),
	crudRoute1 = require('./Routes/v1/crud'),
	// appChat1 = require('./dao/v1/appChat')

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
	swaggerUi = require('swagger-ui-express')
	require('dotenv').config(),
	cors = require('cors')

const _ = require('underscore');

var options = {
key: fs.readFileSync('/etc/nginx/ssl/lal10.key').toString(),
cert: fs.readFileSync('/etc/nginx/ssl/lal10.crt').toString(),
};
var server = require('https').Server(options, app);


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

// v1 api start
app.use('/api/v1/user', userRoute1);
app.use('/api/v1/artisan', artisanRoute1);
app.use('/api/v1/products', productRoute1);
app.use('/api/v1/admin', adminRoute1);
app.use('/api/v1/shop', shopRoute1);
app.use('/api/v1/master', masterRoute1);
app.use('/api/v1/app', appRoute1);
app.use('/api/v1/web', webRoute1);
app.use('/api/v1/crud', crudRoute1);

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


app.use( (err, req, res, next) => {
	console.log(err, "global handler")
	return res.status(util.statusCode.FOUR_ZERO_ZERO).send({ "errorCode": util.statusCode.FOUR_ZERO_ZERO, "errorMessage": util.statusMessage.SOMETHING_WENT_WRONG });
});


// const PORT = process.env.PORT || 5656
const PORT = process.env.PORT || 5578
server.listen(PORT, function (err) {
	console.log('Server running on port ', PORT);
})



// ++++++++++++++==========Socket code Start+++++++++=======//

const userList = [];
const windowList = [];

io.on('connection', function (socket) {
	io.clients((error, clients) => {
	  if (error) throw error;
	  console.log(clients);
	})

	// initilize the socket
	socket.on('online', async function (data){

		  const UserData=[];
		  let ReciverSocketId;
		  UserData.socketId = socket.id;
		  UserData.id = data.fromId;
		  userList.push(UserData);

		  await appChat.deliverdMessage(data);

		  let result=appChat.getdeliverdMessageToUserId(data)

		  for(index=0;index<result.length;index++){
				ReciverSocketId = _.findWhere(userList,{id:`${result[index].fromId}`});
				io.sockets.to(ReciverSocketId.socketId).emit('readTik', {"result":'Read'});
			}

		  console.log("online USERS,",userList)
	})

	//log out
	socket.on('windowOn',async function(data){
	let WindowUserData=[];
		WindowUserData.fromId = data.fromId;
		WindowUserData.EnqId = data.EnqId;
		windowList.push(WindowUserData);
		console.log('windowList windowList',windowList)
	})

	//log out
	socket.on('windowOff',async function(data){
	let Windowdata = _.findWhere(windowList,{fromId:data.fromId,EnqId:data.EnqId});
		if(Windowdata){
			windowList = _.without(windowList,Windowdata);
		}
		console.log('windowList windowList',windowList)
	})


	//log out
	socket.on('disconnect',function(){

		console.log('before remove',userList)

		let user = _.findWhere(userList,{socketId:socket.id});

		if(user){
			userList = _.without(userList,user);
			io.emit('userList',userList);
		}

		console.log('after remove',userList)

	})


	// Sending a Message
	socket.on('sendMessage', function (data){

		 appChat.sendChatMessage(data, async (err, dbData) => {

			if (err){
			  	io.sockets.to(socket.id).emit('error_callback', { "message": "error occur." });
			}

			const Windowdata = _.findWhere(windowList,{fromId:data.toId,EnqId:data.EnqId});

			if(Windowdata){
				await appChat.readMessage(data);
			}


			// const senderData = await appChat.getSenderDetails(data);  // sender user data
			const getRecentChatData = await appChat.getchatData(data); // last chat data

			// fetching a reciver end socket Id
			const toSocket = _.findWhere(userList,{id:`${getRecentChatData.toId}`});

			// console.log("toSocket.socketId==",toSocket.length)
			console.log("toSocket==",toSocket)

			if(toSocket) {

				const getChatRecieverData ={}; // transfer getRecentChatData data to reciver array data
				const enquiryChat ={};

				getChatRecieverData.created_at2 =getRecentChatData.created_at2
				getChatRecieverData.created_at =getRecentChatData.created_at
				getChatRecieverData.id = getRecentChatData.id
				getChatRecieverData.EnqId = getRecentChatData.EnqId
				getChatRecieverData.fromId = getRecentChatData.fromId
				getChatRecieverData.toId = getRecentChatData.toId
				getChatRecieverData.message = getRecentChatData.message
				getChatRecieverData.files = getRecentChatData.files
				getChatRecieverData.isRead = getRecentChatData.isRead

				enquiryChat.EnqId = data.EnqId;

				enquiryChat.totalUnread = await appChat.getUnreadEnqCount(data);

				enquiryChat.totalCount = await appChat.getUnreadCount(data);

				console.log("receiveMessage hit ")

				io.sockets.to(toSocket.socketId).emit('receiveMessage', {"result":getChatRecieverData});

				const Windowdata = _.findWhere(windowList,{fromId:data.toId,EnqId:data.EnqId});

				if(Windowdata){

					console.log("Windowdata===== hit Windowdata",Windowdata)

				}else{

					io.sockets.to(toSocket.socketId).emit('receiveEnquiryChat', {"result":enquiryChat});

					io.sockets.to(toSocket.socketId).emit('receiveOrderChat', {"result":enquiryChat});
				}

			}else{

				// sending offline user to nottification
			//   const message = data.msg;
			//   const notiType='Chat';
			//   const title=sendData.first_name +' ' + sendData.last_name +' sent you a message'

				// notify.SENDER_DATA(notiType,userData.device_id,userData.web_id, device_type, title, message,userData,acc_type,data.r_id,data.s_id)
				// notify.SENDER_DATA(notiType,userData.gcm_id,device_type,title,message,sendData,data.r_id,data.s_id)
			}

			const SenderSocketId = _.findWhere(userList,{id:`${data.fromId}`});

			console.log("SenderSocketId==",SenderSocketId)

			console.log("SenderSocketId.socketId==",SenderSocketId.socketId)

			// sending message to broadcast to emit data to sender end
			io.sockets.to(SenderSocketId.socketId).emit('receiveMessage', {"result":getRecentChatData});
 		 })
	  })

	  socket.on('getMessage', async function (data){

		const dbData = await appChat.getMessage(data);  // sender user data

		console.log("data====",data)

		console.log("getMessage_userList ",userList)


		const toSocket = _.findWhere(userList,{id:`${data.fromId}`});
		// const toSocket=userList.filter(element=>{
		// 	console.log("element===",element)
		// 	console.log("data.fromId===",data.fromId)
		// 		if(element.id===data.fromId)
		// 		return true;
		// })

		console.log("toSocket==",toSocket)

		io.sockets.to(toSocket.socketId).emit('getMessage', {"result":dbData});

		const ReciverSocketId = _.findWhere(userList,{id:`${data.toId}`});

		if(ReciverSocketId){
			io.sockets.to(ReciverSocketId.socketId).emit('blueTik', {"result":'Read'});
		}
	})

	socket.on('readMessage', async function (data){

		console.log("readMessage hit ")

		console.log("readMessage==",data)

		const dbData = await appChat.readMessage(data);  // sender user data

		const SenderSocketId = _.findWhere(userList,{id:`${data.fromId}`});

		io.sockets.to(SenderSocketId.socketId).emit('receiveMessage', {"result":'Read'});

		const ReciverSocketId = _.findWhere(userList,{id:`${data.toId}`});


		if(ReciverSocketId)
			io.sockets.to(ReciverSocketId.socketId).emit('blueTik', {"result":'Read'});

	})


});

// ++++++++++++++==========Socket code END +++++++++=======//

//
// online Request {"fromId":"2"}
// sendMessage Request {"EnqId":"1","fromId":"3","toId":"2", "msg":"lest","files":"1573095501rd.png","type":"image,video,text" }
// online
// sendMessage
// getChatList
// disconnectChat
// receiveMessage
// messageDelete
// disconnect

// sample
// {
// 	"EnqId":"1",
// 	"fromId":"1",
// 	"toId":"13",
// 	"msg":"sdbhsbadjstext",
// 	"files":"jasbdjbsdtext.jpg",
// 	"type":"text"
// }