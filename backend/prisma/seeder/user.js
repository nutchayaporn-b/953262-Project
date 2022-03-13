const bcrypt = require('bcrypt');

const password = bcrypt.hashSync('123456', 10);

const users = [
    {
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: password,
        role: 'customer',
    },
    {
        name: 'Albert Einstein',
        email: 'alberteinstein@email.com',
        password: password,
        role: 'kitchen',
    },
];

module.exports = users;
