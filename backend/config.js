const config = {
    server: {
        port: 7000, //server port
        mode: 'production',
    },
    jwt: {
        secret: 'PdSgVkYp3s6v9y$B&E)H+MbQeThWmZq4',
        expiresIn: '72h',
    },
    cors: {
        allowed_list: ['http://localhost:8080', 'http://localhost:3000'],
    },
};

module.exports = config;
