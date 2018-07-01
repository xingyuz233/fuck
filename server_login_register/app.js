const Koa = require('koa');
const cors = require('kcors');
const session = require('koa-session2');
const bodyParser = require('koa-bodyparser');

const model = require('./model');
const rest = require('./rest');
const controller = require('./controller');

// init db
model.sync();

// init app
const app = new Koa();

// enable cors
app.use(cors({ credentials: true }));

// init session
app.use(session());

// parse request body
app.use(bodyParser());

// prepare restful service
app.use(rest.restify());

// add controller
app.use(controller());

// run app
const server = app.listen(3006);


console.log('app started at port 3006...');