const db = require('../db');

module.exports = db.defineModel('users', {
    username: {
        type: db.STRING,
        unique: true
    },
    password: db.STRING(60),
});