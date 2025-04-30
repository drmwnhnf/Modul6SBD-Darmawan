const transactionController = require("../controllers/transaction.controller");
const express = require('express');
const router = express.Router();

router.get('/', transactionController.getAllTransactions);

router.post('/create', transactionController.createTransaction);

router.post('/pay/:id', transactionController.pay);

router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;