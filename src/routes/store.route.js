const storeController = require("../controllers/store.controller");
const express = require('express');
const router = express.Router();

router.get('/getAll', storeController.getAllstore);

router.post('/create', storeController.createStore);

router.get('/:id', storeController.getStorebyId);

router.put('/', storeController.updateStore);

router.delete('/:id', storeController.deleteStore);

module.exports = router;