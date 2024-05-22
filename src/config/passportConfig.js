import passport from 'passport';
import local from 'passport-local';
import GithubStrategy from 'passport-github2';
import userModel from '../models/userModel.js';
import { createHash, isValidPassword } from '../utils/cryptoUtil.js';

const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new localStrategy(
        {
            passReqToCallback: true,
            usernameField: 'user',
            passwordField: 'password'
        }, async (req, email, password, done) => {

            const { user } = req.body;
            
            try {
                let myUser = await userModel.findOne({ email });
                
                if (!myUser) {
                    const newUser =  {
                        user,
                        email,
                        password: createHash(password)
                    }

                    let result = await userModel.create(newUser);
                    
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
            clientID: 'Iv1.b95f5e07cc384cfb',
            clientSecret: '53fef6c19113d8d0762bcb76a95e448d55e920a2',
            callbackURL: 'http://localhost:8080/api/sessions/github'
        }, async (_accessToken, _refreshToken, profile, done) => {
            try {
                let myUser = await userModel.findOne({ user: profile._json.name });

                if (!myUser) {
                    let newUser = {
                        user: profile._json.name,
                        email: profile._json.email,
                    }

                    let result = await userModel.create(newUser);
                    done(null, result);
                } else {
                    done(null, myUser);
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
