const userRepository = require("../repositories/user.repository");
const baseResponse = require("../utils/baseResponse.util");
const hasher = require("../utils/hasher.util");

exports.register = async (req, res) => {
    if (!req.query.name || !req.query.email || !req.query.password) {
        return baseResponse(res, false, 400, "Missing email or name or password", null);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;
    
    if (!emailRegex.test(req.query.email) || !passwordRegex.test(req.query.password)) {
        return baseResponse(res, false, 400, "Email or password isn't valid", null);
    }

    try {
        if (await userRepository.getUserbyEmail(req.query.email)) {
            return baseResponse(res, false, 400, "Email already used", null);
        }

        const hashedPassword = await hasher.hashThis(req.query.password);

        let userObject = {
            name: req.query.name,
            email: req.query.email,
            password: hashedPassword
        }

        const user = await userRepository.register(userObject);
        if (user) baseResponse(res, true, 201, "User created", user);
        else baseResponse(res, false, 400, "User not created", null);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
};

exports.login = async (req, res) => {
    const {email, password} = req.query;

    try {
        const user = await userRepository.getUserbyEmail(email);
        const validity = await hasher.compareHash(password, user.password);

        if (validity) baseResponse(res, true, 200, "Login success", user);
        else baseResponse(res, false, 404, "Invalid email or password", null);
    }
    catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.getUserbyEmail = async (req, res) => {
    try {
        const user = await userRepository.getUserbyEmail(req.params.email)
        if (user) baseResponse(res, true, 200, "User found", user);
        else baseResponse(res, false, 404, "User not found", null);
    }
    catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.updateUser = async (req, res) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!emailRegex.test(req.body.email) || !passwordRegex.test(req.body.password)) {
        return baseResponse(res, false, 400, "Email or password isn't valid", null);
    }

    try {
        const hashedPassword = await hasher.hashThis(req.body.password);

        let userObject = {
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }

        const user = await userRepository.updateUser(userObject);
        if (user) baseResponse(res, true, 200, "User updated", user);
        else baseResponse(res, false, 404, "User not found", null);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.deleteUser = async (req, res) => {
    const {id} = req.params;
    try {
        if (!await userRepository.getUserbyId(id)) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        const user = await userRepository.deleteUser(id);
        baseResponse(res, true, 200, "User deleted", user);
    }
    catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}

exports.topUp = async (req, res) => {
    const {id, amount} = req.query;

    if (amount <= 0) return baseResponse(res, false, 400, "Amount must be larger than 0", null);

    try {
        if (!await userRepository.getUserbyId(id)) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        const user = await userRepository.topUp(id, amount);
        baseResponse(res, true, 200, "Top up successful", user);
    }
    catch (error) {
        baseResponse(res, false, 500, error.message || "Server error", error);
    }
}