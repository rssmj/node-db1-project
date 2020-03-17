const express = require('express');
const server = express().use(express.json());

const accountsRouter = require('../accounts/accountsRouter.js');
server.use('/api/accounts', accountsRouter);

server.get('/', (req, res) => {
	res.status(200).json('[-_-]');
});

module.exports = server;
