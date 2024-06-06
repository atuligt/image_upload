
const mysql = require('mysql2/promise');
const connection = mysql.createPool({
    host: 'bqjafig0k0yg5skqxa2h-mysql.services.clever-cloud.com',
    user: 'uq1nq01l9pfojf6p',
    password: "cxdF2gLbU4TtDhWvaSte",
    database: 'bqjafig0k0yg5skqxa2h',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0
});

exports.connection = connection;