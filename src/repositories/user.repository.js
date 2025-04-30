const db = require('../database/pg.database');

exports.register = async (user) => {
    try {
        const res = await db.query(
            "INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING *", 
            [user.name, user.password, user.email]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.getUserbyEmail = async (email) => {
    try {
        const res = await db.query(
            "SELECT * FROM users WHERE email = $1", 
            [email]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.login = async (email, password) => {
    try {
        const res = await db.query(
            "SELECT * FROM users WHERE email = $1 AND password = $2", 
            [email, password]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.updateUser = async (user) => {
    try {
        const res = await db.query(
            "UPDATE users SET name = $1, password = $2, email = $3 WHERE id = $4 RETURNING *", 
            [user.name, user.password, user.email, user.id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.getUserbyId = async (id) => {
    try {
        const res = await db.query(
            "SELECT * FROM users WHERE id = $1", 
            [id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.deleteUser = async (id) => {
    try {
        const res = await db.query(
            "DELETE FROM users WHERE id = $1 RETURNING *", 
            [id]
        );
        return res.rows[0]
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.topUp = async (id, amount) => {
    try {
        const res = await db.query(
            "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *", 
            [amount, id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}