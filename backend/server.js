const express = require('express');
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');

const config = require('./config');
const routes = require('./routes');

const app = express();

const PORT = config.server.port;

let cors_options = {
    origin: config.cors.allowed_list,
    credentials: true,
};

app.set('trust proxy', 1); // trust first proxy

if (app.get('env') === 'production' || config.server.mode === 'production') {
    app.set('env', 'production');
}

app.disable('x-powered-by');

app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard());
app.use(helmet.expectCt());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.xssFilter());

app.use(
    express.urlencoded({
        // Middleware
        extended: true,
    }),
);

app.use(express.json());
app.use(cookieParser());

app.use(cors(cors_options));

app.use(compression());

const main = async function () {
    app.use(routes);

    app.all('*', function (req, res) {
        res.status(404).json({
            success: false,
            message: 'Resource Not Found',
            error: {
                code: 404,
                message: 'Not Found',
            },
        });
    });

    let server = http.createServer(app);
    return server;
};

main()
    .then(function (server) {
        server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    })
    .catch(function (err) {
        console.log(err);
    });
