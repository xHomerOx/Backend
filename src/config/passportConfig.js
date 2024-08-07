import passport from 'passport';
import local from 'passport-local';
import GithubStrategy from 'passport-github2';
import userModel from '../models/userModel.js';
import { createHash, isValidPassword } from '../utils/cryptoUtil.js';
import dotenv from 'dotenv';
import jwt, { ExtractJwt } from 'passport-jwt';
import { cartModel } from '../models/cartModel.js';

dotenv.config();

const localStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;

const initializePassport = () => {
    passport.use('register', new localStrategy(
        {
            passReqToCallback: true,
            usernameField: 'user',
            passwordField: 'password'
        }, async (req, user, password, done) => {

            const { email } = req.body;
            
            try {
                let myUser = await userModel.findOne({ email });
                
                if (!myUser) {
                    const newUser =  {
                        user,
                        email,
                        password: createHash(password)
                    }

                    let result = await userModel.create(newUser);
                    const cart = await cartModel.create({});
                    result.cart = cart._id;
                    
                    await result.save();

                    return done(null, result);
                }else{
                    return done(null, false);
                }
            } catch (error) {
                return done(error);
            }
        }
    ))

    passport.use('login', new localStrategy(
        {
            passReqToCallback: true,
            usernameField: 'user'
        }, async (_req, username, password, done) => {
            try {
                let myUser = await userModel.findOne({ user: username });

                if (!myUser) {
                    return done(null, false);
                }
                
                const isValid = isValidPassword(myUser, password);

                if (isValid) {

                    const cart = await cartModel.findOne({ _id: myUser.cart });

                    if (cart) {
                        cart.products = [];
                        await cart.save();
                    }

                    return done(null, myUser);
                } else {
                    return done(null, false);
                }
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('github', new GithubStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL
        }, async (_accessToken, _refreshToken, profile, done) => {
            try {
                let myUser = await userModel.findOne({ user: profile._json.name });

                if (!myUser) {
                    let newUser = {
                        user: profile._json.name,
                        email: profile._json.email || '',
                    }

                    let result = await userModel.create(newUser);
                    const cart = await cartModel.create({});
                    result.cart = cart._id;
                    
                    await result.save();
                    
                    done(null, result);
                } else {
                    if (myUser.cart) {
                        await cartModel.findByIdAndUpdate(myUser.cart, { products: [] });
                    }

                    done(null, myUser);
                }
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use("jwt", new JWTStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.JWT_SECRET
        },
        async (jwt_payload, done) => {
            try {
                const user = await userModel.findById(jwt_payload._id);
                
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } catch (error) {
                return done(error);
            }
        }
    ));
    
    passport.serializeUser(async (user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        let myUser = await userModel.findById(id);
        done(null, myUser);
    })
}

export default initializePassport;