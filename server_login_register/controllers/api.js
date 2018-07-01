const bcrypt = require('bcryptjs');

const APIError = require('../rest').APIError;
const util = require('../util');

module.exports = {
    'POST /api/user/register': async (ctx, next) => {
        const username = ctx.request.body.username;
        const password = ctx.request.body.password;
        
        console.log(username);
        console.log(password);
        // check if the request is valid
        if (!(username && password)) throw new APIError('request_invalid');
        if (username.length>20) throw new APIError('username_too_long');
        console.log("paramater checked!");
        // check if username existed
        const oldUser = await util.getUserByName(username);
        if (oldUser) throw new APIError('username_existed');
        console.log("no existed user");

        // create user
        const user = {
            username: username,
            password: await bcrypt.hash(password, await bcrypt.genSalt()),
        };
        console.log("user created!");
        await util.createUser(user);

        ctx.rest({});

        await next();
    },
    'POST /api/user/login': async (ctx, next) => {
        const username = ctx.request.body.username;
        const password = ctx.request.body.password;

        // check if the request is valid
        if (!(username && password)) throw new APIError('request_invalid');

        // validate username
        const user = await util.getUserByName(username);
        if (!user) throw new APIError('user_not_exist');

        // validate password
        if (!await bcrypt.compare(password, user.password)) throw new APIError('password_mismatch');

        // set session
        ctx.session.user = user.id;
        console.log("login succeeded! id="+user.id)

        ctx.rest({});

        await next();
    },
    'POST /api/user/logout': async (ctx, next) => {
        // unset session
        ctx.session.user = null;

        ctx.rest({});

        await next();
    },
    
};
