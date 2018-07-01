const model = require('./model');
const User = model.users;

module.exports = {
    createUser: async user => await User.create(user),
    getUserByID: async id => await User.findById(id),
    getUserByName: async username => await User.findOne({ where: { username: username } }),
};