const passport = require("passport");
const local = require("passport-local");
const GithubStrategy = require("passport-github2");

const UserModels = require("../Models/usuario.model.js");
const { createHash, isValidPassword } = require("../utils/utils.js");
const LocalStrategy = local.Strategy;

const iniatializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    },
        async (req, username, password, done) => {
            const { first_name, last_name, age } = req.body;
            try {
                let user = await UserModels.findOne({ email: username });
                if (user) {
                    return done(null, false);
                }
                let newUser = await UserModels.create({ first_name, last_name, email: username, password: createHash(password), age });
                let result = await newUser.create(user);

                return done(null, result);
            } catch (error) {
                return done(error);
            }
        }))

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            let user = await UserModels.findOne({ email });
            if (!user) {
                return done(null, false);
            }
            if (!isValidPassword(user, password)) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })
    passport.deserializeUser(async (id, done) => {
        let user = await UserModels.findById(id);
        done(null, user);
    })

    passport.use("github", new GithubStrategy({
        clientID: "Iv23liRf0e6wXaqkX97p",
        clientSecret: "85e8a02f4590b514ad4876c2ea7948280c3f2600",
        callbackURL: "http://localhost:8080/api/session/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModels.findOne({ email: profile._json.email });
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    email: profile._json.email,
                    password: "",
                    age: 37
               }
               let result = await UserModels.create(newUser);
               return done(null, result);
            }else {
                return done(null, user);
            }           
            
        } catch (error) {
            return done(error);
        }
    }))
}

module.exports = iniatializePassport