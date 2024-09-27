const { Router } = require("express");
const router = Router();
const UserModels = require("../Models/usuario.model");
const { isValidPassword, createHash } = require("../utils/utils.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/jsonwebtoken.js");

router.post ("/register", async(req, res) => {
    const { first_name, last_name, email, password, age } = req.body;
    try {
        const existeUsuario = await UserModels.findOne({ email });
        if (existeUsuario) {
            return res.status(400).send({ error: "El usuario ya existe" });
        }
        const nuevoUser = await UserModels.create({ first_name, last_name, email, password, age });
        
        await nuevoUser.save();

        const token = generateToken({
            first_name: nuevoUser.first_name,
            last_name: nuevoUser.last_name,            
            email: nuevoUser.email,
            age: nuevoUser.age,
            password: createHash(password)
        });
        res.cookie("token", token,{
            maxAge: 3600000,
            httpOnly: true,
        });
        res.status(200).send(nuevoUser);        
    } catch (error) {
        res.status(500).send({ error: "Error del servidor" });
        console.log(error);
        
    }
});
 

router.post("/register", passport.authenticate("register", {failureRedirect: "/api/sessions/failregister"}), async(req, res) => {

    req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
    }
    req.session = true;
    res.redirect("/profile");
} )
router.get("/failregister", (req, res) => {
    res.send("Fallo todo");
})


router.post("/login", passport.authenticate("login", {failureRedirect: "/api/sessions/faillogin"}), async (req, res) => {
    req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
    }
    req.session.login = true;
    res.redirect("/profile");
})
router.get("/faillogin", (req, res) => {
    res.send("Fallo todo");
})

//JSONWEBTOKEN
router.get("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModels.findOne({ email });
        if (!user) {
            res.status(404).send({ error: "Usuario incorrecto" });
        } 
        if (!isValidPassword(user, password)) {
            res.status(401).send({ error: "contrseña incorrecta" });
        }
        const token = generateToken({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        });
        res.send({message: "login correcto", token: token});
    } catch (error) {        
        res.status(500).send({ error: "Error del servidor" });
    }
})
router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

//GITHUB
router.get("/github", passport.authenticate("github", {scope: ["profile", "user:email"]} ), async (req, res) => {

})
router.get("/gitgubcallback", passport.authenticate("github", {failureRedirect: "/login"}) ,async (req, res) => {
    req.sessionStore.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
})



module.exports = router;