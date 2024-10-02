const { Router } = require("express");
const router = Router();
const UserModels = require("../Models/usuario.model");
const { isValidPassword, createHash } = require("../utils/utils.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/jsonwebtoken.js");

// Registro de usuario
router.post("/register", async (req, res) => {
    const { username, first_name, last_name, email, password, age } = req.body;
    try {
        const existeUsuario = await UserModels.findOne({ email });
        if (existeUsuario) {
            return res.status(400).send({ error: "El usuario ya existe" });
        }

        const hashedPassword = createHash(password);
        const nuevoUser = await UserModels.create({ 
            first_name, 
            last_name, 
            email, 
            password: hashedPassword, 
            age 
        });

        const token = generateToken({
            first_name: nuevoUser.first_name,
            last_name: nuevoUser.last_name,
            email: nuevoUser.email,
            age: nuevoUser.age
        });

        res.cookie("token", token, {
            maxAge: 3600000,
            httpOnly: true,
        });

        res.redirect("/api/sessions/current");
    } catch (error) {
        res.status(500).send({ error: "Error del servidor" });
        console.error(error);
    }
});

// Inicio de sesión
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuarioHallado = await UserModels.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: "Usuario no encontrado" });
        }
        if (!isValidPassword(usuarioHallado, password)) {
            return res.status(401).send({ error: "Contraseña incorrecta" });
        }

        const token = generateToken();
        
        res.cookie("Token", token, {
            maxAge: 3600000, 
            httpOnly: true
        })

        res.redirect("/api/sessions/current"); 

    } catch (error) {
        res.status(500).send({ error: "Error del servidor" });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.render("home", { user: req.user });
});

router.post("/admin", passport.authenticate("jwt", { session: false }), (req, res) => {
    if(req.user.rol !== "Admin") {
        return res.status(401).send({ error: "No autorizado" });
    }
    res.render("admin", { user: req.user });
});

// Ruta para el perfil
router.get("/perfil", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    res.render("perfil", { user: req.session.user });
});

module.exports = router;
