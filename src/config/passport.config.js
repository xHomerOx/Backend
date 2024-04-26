import passport from 'passport';
import local from 'passport-local';
import GithubStrategy from 'passport-github2';
import userModel from '../models/userModel.js';
import { createHash, isValidPassword } from '../utils/utils.js';

const localStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new localStrategy(
        {
            passReqToCallback: true,
            usernameField: 'user'
        }, async (req, username, password, done) => {
            const { user } = req.body;

            try {
                let myUser = await userModel.findOne({user: username});
                
                if (!myUser) {
                    const newUser =  {
                        user,
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
        }, async (req, username, password, done) => {
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
    
    passport.serializeUser(async (user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        let myUser = await userModel.findById(id);
        done(null, myUser);
    })
}

export default initializePassport;
