const express = require('express');
const cors = require('cors')
const storeRouter = require('../src/routes/store.route');
const userRouter = require('../src/routes/user.route');
const itemRouter = require('../src/routes/item.route');
const transactionRouter = require('../src/routes/transaction.route');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const options = {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(options));

app.use('/store', storeRouter);
app.use('/user', userRouter);
app.use('/item', itemRouter);
app.use('/transaction', transactionRouter);

app.get('/', (req, res) => {
    res.send("Hello, world");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;