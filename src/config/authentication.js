import { User } from "../models/user";

var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');

export const initAuth = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env['GOOGLE_CLIENT_ID'],
        clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
        callbackURL: 'https://www.example.com/oauth2/redirect/google'
      },
       async (issuer, profile, cb) => {
        console.log(profile);
        try{
            let user = await User.find({providerId: profile.id, issuer});
            if (user == null || user == undefined){
                user = await (new User({
                    email: profile.email,
                    provider: issuer,
                    providerId: profile.id,
                })).save();
                cb(null, user);
            } else{
                cb(null, user);
            }
        } catch(e){
            cb(e);
        }
      }
       
    ));
    
    
}
