const jwt = require("jsonwebtoken");
const private_key = "clave_secreta";

const generateToken = (user) => {
    const token = jwt.sign(user, private_key, { expiresIn: "1h" });
    return token;
}

module.exports = { generateToken }