const storeRepository = require("../repositories/store.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.getAllstore = async (req, res) => {
    try {
        const stores = await storeRepository.getAllStores();
        baseResponse(res, true, 200, "Stores found", stores);
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving stores", error);
    }
};

exports.createStore = async (req, res) => {
    if (!req.body.name || !req.body.address) {
        return baseResponse(res, false, 400, "Missing store name or address", null);
    }
    try {
        const store = await storeRepository.createStore(req.body);
        baseResponse(res, true, 201, "Store created", store);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
};

exports.getStorebyId = async (req, res) => {
    const {id} = req.params;
    try {
        const store = await storeRepository.getStorebyId(id);
        if (store) baseResponse(res, true, 200, "Store found", store);
        else baseResponse(res, false, 404, "Store not found", null);
    }
    catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.updateStore = async (req, res) => {
    if (!req.body.name || !req.body.address) {
        return baseResponse(res, false, 400, "Missing store name or address", null);
    }
    try {
        const store = await storeRepository.updateStore(req.body);
        if (store) baseResponse(res, true, 200, "Store updated", store);
        else baseResponse(res, false, 404, "Store not found", null);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.deleteStore = async (req, res) => {
    const {id} = req.params;
    try {
        if (!await storeRepository.getStorebyId(id)) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        const store = await storeRepository.deleteStore(id);
        baseResponse(res, true, 200, "Store deleted", store);
    }
    catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}