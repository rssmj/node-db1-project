const express = require('express');

// connection to database using Knex
const db = require('../data/dbConfig.js');

const router = express.Router();

// get accounts from db
router.get('/', (req, res) => {
	// select * from accounts,
	db.select('*')
		.from('accounts') // returns promise
		.then(rows => {
			res.status(200).json({ data: rows });
		})
		.catch(() => {
			res.status(500).json({ response: 'error, try something else' });
		});
});

// order by id, desc, limit 7
router.get('/order/id', (req, res) => {
	const { id } = req.params;
	const limit = req.query.limit || 7;
	// const limit = (req.query.limit = 7);
	const sortBy = req.query.sortBy || 'id';
	// const sortBy = (req.query.sortBy = 'id');
	const sortDir = req.query.sortDir || 'desc';
	// const sortDir = (req.query.sortDir = 'desc');
	db.select(id, '*')
		.from('accounts')
		.limit(limit)
		.orderBy(sortBy, sortDir)
		.then(order => {
			res.status(200).json({ data: order });
		})
		.catch(() => {
			res.status(500).json({ response: `error ordering accounts by 'id'` });
		});
});

// order by budget, desc, limit 11
router.get('/order/budget', (req, res) => {
	const limit = req.query.limit || 11;
	const sortBy = req.query.sortBy || 'budget';
	const sortDir = req.query.sortDir || 'desc';
	db.select('*')
		.from('accounts')
		.orderBy(sortBy, sortDir)
		.limit(limit)
		.then(budgetOrder => {
			res.status(200).json({ data: budgetOrder });
		})
		.catch(() => {
			res.status(500).json({ response: `error ordering accounts by 'budget'` });
		});
});

// count by name
router.get('/count/name', (req, res) => {
	const countBy = req.query.countBy || 'name';
	db('accounts')
		.count(countBy, { as: 'nameCount' })
		.then(nameCount => {
			res.status(200).json({ data: nameCount });
		})
		.catch(() => {
			res.status(500).json({ response: `error ordering accounts by 'name'` });
		});
});

// get by 'id'
router.get('/:id', (req, res) => {
	const { id } = req.params;
	db('accounts')
		.where({ id })
		// .where("id", "=", req.params.id)
		// .where({ id: req.params.id })
		.first() // gets first element
		.then(account => {
			account
				? res.status(200).json({ data: account })
				: res.status(404).json({ response: 'hmm, no account found' });
		})
		.catch(() => {
			res.status(500).json({ response: 'errors happened' });
		});
});

// insert data
router.post('/', (req, res) => {
	const body = req.body;
	const { id } = req.params;
	db('accounts')
		.insert(body, id)
		.then(ids => {
			res.status(201).json({ results: ids });
		})
		.catch(() => {
			res.status(500).json({ response: 'error is error' });
		});
});

// update data
router.put('/:id', (req, res) => {
	const changes = req.body;
	const { id } = req.params;
	db('accounts')
		.where({ id })
		.update(changes)
		.then(count => {
			count > 0
				? res.status(200).json({ response: 'account updated' })
				: res.status(404).json({ response: 'none accounts found' });
		})
		.catch(() => {
			res.status(500).json({ response: 'e r r o r' });
		});
});

// delete data
router.delete('/:id', (req, res) => {
	const { id } = req.params;
	db('accounts')
		.where({ id })
		.del()
		.then(count => {
			count > 0
				? res.status(200).json({ response: 'account deleted' })
				: res.status(404).json({ response: 'found nothing' });
		})
		.catch(() => {
			res.status(500).json({ response: `error, that didn't work` });
		});
});

module.exports = router;
