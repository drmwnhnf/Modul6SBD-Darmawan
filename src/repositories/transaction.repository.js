const db = require('../database/pg.database');

exports.getAllTransactions = async () => {
    try {
        const res = await db.query(
            "SELECT * FROM  transactions"
        );
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.createTransaction = async (transaction) => {
    try {
        const item = await db.query(
            "SELECT * FROM items WHERE id = $1",
            [transaction.item_id]
        );

        const res = await db.query(
            "INSERT INTO transactions (item_id, quantity, user_id, total) VALUES ($1, $2, $3, $4) RETURNING *", 
            [transaction.item_id, transaction.quantity, transaction.user_id, (item.rows[0].price * transaction.quantity)]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.getTransactionbyId = async (id) => {
    try {
        const res = await db.query(
            "SELECT * FROM transactions WHERE id = $1",
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.pay = async (id) => {
    try {
        const transaction = await db.query(
            "SELECT * FROM transactions WHERE id = $1", 
            [id]
        );

        await db.query(
            "UPDATE users SET balance = balance - $1 WHERE id = $2",
            [transaction.total, transaction.user_id]
        )

        await db.query(
            "UPDATE items SET stock = stock - $1 WHERE id = $2 RETURNING *",
            [transaction.quantity, transaction.item_id]
        );

        const res = await db.query(
            "UPDATE transactions SET status = 'paid' WHERE id = $1 RETURNING *", 
            [id]
        );

        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.deleteTransaction = async (id) => {
    try {
        const res = await db.query(
            "DELETE FROM transactions WHERE id = $1 RETURNING *", 
            [id]
        );
        return res.rows[0]
    } catch (error) {
        console.error("Error executing query", error);
    }
}