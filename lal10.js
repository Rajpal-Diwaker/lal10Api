const express = require('express'),
	app = express(),
	// server = require('http').Server(app),
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
	crudRoute2 = require('./Routes/v2/crud');
	// appChat = require('./dao/v2/appChat');

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
const compression = require('compression')

// var options = {
// key: fs.readFileSync('/etc/nginx/ssl/lal10.key').toString(),
// cert: fs.readFileSync('/etc/nginx/ssl/lal10.crt').toString(),
// };
// var server = require('https').Server(options, app);

app.use(morgan('dev'))

app.use(timeout('600s'))
app.use(compression())

// var corsOptions = {
//     origin: 'http://localhost:8080',
//     optionsSuccessStatus: 200 ,
//     methods: "PUT, POST"
// }
// app.use(cors(corsOptions));

app.use(cors());
app.disable("X-Powered-By")

app.use("/admin", express.static(path.resolve(__dirname, '../lal10adminother')));

app.get('/admin', (req, res) => {
	const pth = path.resolve(__dirname, '../lal10adminother')
	// console.log(pth, "pthhhhhhhhhhhhhhh")
	res.sendFile(`${pth}/index.html`);
})
// app.use("/lal10admin", express.static(path.resolve(__dirname, '../lal10admin')));

// app.get('/lal10admin', (req, res) => {
// 	const pth = path.resolve(__dirname, '../lal10admin')
// 	res.sendFile(`${pth}/index.html`);
// })

app.use("/", express.static(path.resolve(__dirname, '../lal10websiteother')));

app.get('/', (req, res) => {
	const pth = path.resolve(__dirname, '../lal10websiteother')
	res.sendFile(`${pth}/index.html`);
})

app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	// res.header("Access-Control-Allow-Origin", "https://lal10.com");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, noauth, Authorization, authorization");
	// res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST,PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next()
});

app.get('/makePassword', async (req, res) => {
	const bcrypt = require('bcrypt')
	const newHash = await bcrypt.hash(req.query.pass, util.saltRounds());
	// console.log(newHash)
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

const options2 = {
	swaggerDefinition,
	apis: ['./Routes/v2/*.js']
}

app.get('/swagger.json', function (req, res) {
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

module.exports = app;

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
