const jwt = require("jsonwebtoken");
const private_key = "clave_secreta";

const generateToken = (usuarioHallado) => {
    const token = jwt.sign({usuario: usuarioHallado.usuario, rol: usuarioHallado.rol,expiresIn: '24h' });
    return token;
}

module.exports = { generateToken }