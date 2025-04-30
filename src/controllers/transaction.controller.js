const transactionRepository = require('../repositories/transaction.repository');
const itemRepository = require("../repositories/item.repository");
const userRepository = require("../repositories/user.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.getAllTransactions = async (req, res) => {
    try {
        const transaction = await transactionRepository.getAllTransactions();
        baseResponse(res, true, 200, "Transactions found", transaction);
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving transactions", error);
    }
}

exports.createTransaction = async (req, res) => {
    try {
        const { item_id, quantity, user_id } = req.body;

        if (quantity <= 0) return baseResponse(res, false, 400, "Quantity must be larger than 0", null);

        const item = await itemRepository.getItembyId(item_id);
        if (!item) return baseResponse(res, false, 404, "Item doesn't exist", null);

        const user = await userRepository.getUserbyId(user_id);
        if (!user) return baseResponse(res, false, 404, "User doesn't exist", null);

        const transaction = await transactionRepository.createTransaction(req.body);
        
        baseResponse(res, true, 201, "Transaction created", transaction);

    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
};

exports.pay = async (req, res) => {
    try {
        const { id } = req.params;

        const transactionCheck = await transactionRepository.getTransactionbyId(id);
        if (!transactionCheck) return baseResponse(res, false, 404, "Failed to pay", null);

        const item = await itemRepository.getItembyId(transactionCheck.item_id);
        const user = await userRepository.getUserbyId(transactionCheck.user_id);

        if (item.stock < transactionCheck.quantity) {
            return baseResponse(res, false, 400, "Failed to pay", null);
        }

        if (user.balance < (transactionCheck.quantity * item.price)) {
            return baseResponse(res, false, 400, "Failed to pay", null);
        }

        const transaction = await transactionRepository.pay(id);
        
        baseResponse(res, true, 200, "Payment successful", transaction);

    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
};

exports.deleteTransaction = async (req, res) => {
    const {id} = req.params;
    try {
        if (!await transactionRepository.getTransactionbyId(id)) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }
        const transaction = await transactionRepository.deleteTransaction(id);
        baseResponse(res, true, 200, "Transaction deleted", transaction);
    }
    catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}