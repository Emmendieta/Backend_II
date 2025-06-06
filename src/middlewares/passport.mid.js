import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as PassportStrategy } from "passport-jwt";
import { usersRepository } from "../repositories/repository.js";
import { compareHash, createHash } from "../helpers/hash.helper.js";
import { createToken } from "../helpers/token.helper.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import verifyEmail from "../helpers/verifyEmail.helper.js";

const { PORT } = process.env;

const GOOGLE_URL = `http://localhost:${PORT}/api/auth/google/redirect`;

passport.use(
    "register",
    new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            try {
                if (!req.body.first_name || !req.body.last_name || !req.body.age) { return done(null, null, { message: "Invalid Data!!", statusCode: 400 }); }
                let user = await usersRepository.readByFilter({ email });
                if (user) { return done(null, null, { message: "Ivalid Credentials!", statusCode: 401 }); }
                req.body.password = createHash(password);
                user = await usersRepository.createOne(req.body);
                await verifyEmail(user.email, user.verifyCode);
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
                let user = await usersRepository.readByFilter({ email });
                if (!user) { return done(null, null, { message: "Ivalid Credentials!", statusCode: 401 }); };
                const verifyPassword = compareHash(password, user.password);
                if (!verifyPassword) { return done(null, null, { message: "Ivalid Credentials!", statusCode: 401 }); };
                //Ahora verifico si esta validado el usuario:
                if (!user.isVerified) { return done (null, null, {message: "First you have to verify the Code that was sent to your emial!", statusCode: 401 }); };
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
                const user = await usersRepository.readByFilter({ _id: user_id, email, role });
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
                const user = await usersRepository.readByFilter({ _id: user_id, email, role });
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
                const user = await usersRepository.readByFilter({ _id: user_id, email, role });
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
    new GoogleStrategy(
        { clientID: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET_KEY , callbackURL: GOOGLE_URL, scope: ["email", "profile"] },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { email, name, picture, id } = profile; //El email cuando viene la auth de un tercero no se suele guardar en la BD
                let user = await usersRepository.readByFilter({ email: id });
                if (!user) {
                    user = {
                        first_name: name.givenName,
                        last_name: "Please, update your last name",
                        email: id,
                        password: createHash(email),
                        age: 21
                    };
                    user = await usersRepository.createOne(user);
                };
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

export default passport;