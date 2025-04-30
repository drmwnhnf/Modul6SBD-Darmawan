const bcrypt = require('bcrypt');

const saltRounds = 10;

async function hashThis(plainText) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(plainText, salt);
    return hash;
}

async function compareHash(plainText, hash) {
    return bcrypt.compareSync(plainText, hash);
}

module.exports = {
    hashThis,
    compareHash
};
