const cloudinaryUtil = require("../utils/cloudinary.util");
const itemRepository = require("../repositories/item.repository");
const storeRepository = require("../repositories/store.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.createItem = async (req, res) => {
    try {
        const { name, price, store_id, stock } = req.body;

        if (!name || !price) return baseResponse(res, false, 400, "Missing name or price", null);

        const store = await storeRepository.getStorebyId(store_id);
        if (!store) return baseResponse(res, false, 404, "Store doesn't exist", null);

        let imageUrl = null;
        if (req.file) {
            imageUrl = await cloudinaryUtil.uploadToCloudinary(req.file.buffer, "Modul5_Items");
        }

        const newItem = await itemRepository.createItem({
            name: name,
            price: price,
            store_id: store_id,
            image_url: imageUrl,
            stock: stock || 0
        });
        
        baseResponse(res, true, 201, "Item created", newItem);

    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await itemRepository.getAllItems();
        baseResponse(res, true, 200, "Items found", items);
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving items", error);
    }
};

exports.getItembyId = async (req, res) => {
    const {id} = req.params;
    try {
        const item = await itemRepository.getItembyId(id);
        if (item) baseResponse(res, true, 200, "Item found", item);
        else baseResponse(res, false, 404, "Item not found", null);
    }
    catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.getItembyStoreId = async (req, res) => {
    const {store_id} = req.params;
    try {
        const store = await storeRepository.getStorebyId(store_id);
        if (!store) return baseResponse(res, false, 404, "Store doesn't exist", null);

        const items = await itemRepository.getItembyStoreId(store_id);
        baseResponse(res, true, 200, "Items found", items);
    }
    catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.updateItem = async (req, res) => {
    try {
        const { id, name, price, store_id, stock } = req.body;

        if (!name || !price) return baseResponse(res, false, 400, "Missing name or price", null);

        const store = await storeRepository.getStorebyId(store_id);
        if (!store) return baseResponse(res, false, 404, "Store doesn't exist", null);

        const item = await itemRepository.getItembyId(id);
        if (!item) return baseResponse(res, false, 404, "Item doesn't exist", null);

        let imageUrl = null;
        if (req.file) {
            imageUrl = await cloudinaryUtil.uploadToCloudinary(req.file.buffer, "Modul5_Items");
        }

        const updatedItem = await itemRepository.updateItem({
            id: id,
            name: name,
            price: price,
            store_id: store_id,
            image_url: imageUrl,
            stock: stock || 0
        });

        return baseResponse(res, true, 200, "Item updated", updatedItem);
    } catch (error) {
        return baseResponse(res, false, 500, error.message || "Server error", error);
    }
};

exports.deleteItem = async (req, res) => {
    const {id} = req.params;
    try {
        if (!await itemRepository.getItembyId(id)) {
            return baseResponse(res, false, 404, "Item not found", null);
        }
        const item = await itemRepository.deleteItem(id);
        baseResponse(res, true, 200, "Item deleted", item);
    }
    catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}