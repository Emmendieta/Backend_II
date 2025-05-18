import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as PassportStrategy } from "passport-jwt";
import { usersManager } from "../data/managers/mongo/manager.mongo.js";
import { compareHash, createHash } from "../helpers/hash.helper.js";
import { createToken } from "../helpers/token.helper.js";
import { Strategy as googleStrategy } from "passport-google-oauth2";

passport.use(
    "register",
    new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            try {
                if (!req.body.first_name || !req.body.last_name || !req.body.age) { return done(null, null, { message: "Invalid Data!!", statusCode: 400 }); }
                let user = await usersManager.readByFilter({ email });
                if (user) { return done(null, null, { message: "Ivalid Credentials!", statusCode: 401 }); }
                req.body.password = createHash(password);
                user = await usersManager.createOne(req.body);
                done(null, user); //primer parametro es si ocurre un error, el segundo, son los datos del usuario que se guardan en req
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    "login",
    new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            try {
                let user = await usersManager.readByFilter({ email });
                if (!user) { return done(null, null, { message: "Ivalid Credentials!", statusCode: 401 }); };
                const verifyPassword = compareHash(password, user.password);
                if (!verifyPassword) { return done(null, null, { message: "Ivalid Credentials!", statusCode: 401 }); };
                //Ahora creo el token:
                const data = { user_id: user._id, email: user.email, role: user.role };
                const token = createToken(data);
                user.token = token;
                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    "current",
    new PassportStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
            secretOrKey: process.env.SECRET
        },
        async (data, done) => {
            try {
                const { user_id, email, role } = data;
                const user = await usersManager.readByFilter({ _id: user_id, email, role });
                if (!user) { return done(null, null, { message: "Forbidden!", statusCode: 403 }); }
                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    "user",
    new PassportStrategy(
        {jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
            secretOrKey: process.env.SECRET,
        },
        async (data, done) => {
            try {
                const { user_id, email, role } = data;
                const user = await usersManager.readByFilter({ _id: user_id, email, role });
                if(!user) { return done(null, null, { message: "Forbidden!", statusCode: 403 }); }
                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

passport.use(
    "admin",
    new PassportStrategy(
        {jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]), secretOrKey: process.env.SECRET},
        async (data, done) => {
            try {
                const { user_id, email, role } = data;
                const user = await usersManager.readByFilter({ _id: user_id, email, role });
                if (!user || user.role !== "ADMIN") { return done(null, null, { message: "Forbidden!", statusCode: 403 }); }
                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

/*Google*/

passport.use(
    "google",
    new googleStrategy(
        { clientID: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET_KEY , callbackURL: process.env.GOOGLE_URL },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { email, name, picture, id } = profile; //El email cuando viene la auth de un tercero no se suele guardar en la BD
                let user = await usersManager.readByFilter({ email: id });
                if (!user) {
                    user = {
                        email: id,
                        first_name: name.giveName,
                        last_name: "Please, update your last name",
                        password: createHash(email),
                        age: 21
                    };
                    user = await usersManager.createOne(user);
                };
                const data = { user_id: user._id, email: user.email, role: user.role };
                const token = createToken(data);
                user.token = token;
                done(null, user);
                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);

export default passport;