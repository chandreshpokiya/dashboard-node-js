import passport from 'passport'
import { Strategy } from 'passport-local'
import Admin from '../models/adminSchema.js';

passport.use(new Strategy({
      usernameField: 'username',
}, async (username, password, done) => {
      try {
            const user = await Admin.findOne({ username: username });
            if (!user) { 
                  console.log('user not found')
                  return done(null, false);
            }
            if (user.password != password) {  
                  console.log('password mismatch')
                  return done(null, false);
            }
            return done(null, user);
      } catch (err) { 
            console.log(err.message)
            return done(err)
      }
}));

passport.serializeUser((user, done) => {
      return done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
      try {
            const user = await Admin.findById(id);
            return done(null, user);
      } catch (err) {
            console.log('something went wrong');
            return done(err);
      }
})

export const checkAuthentication = (req, res, next) => {
      if (req.isAuthenticated()) {
            return next();
      }
      req.flash('error','Youare not authorized ! please login first');
      return res.redirect('/admin/login');
} 
passport.setAuthenticatedUser = (req, res, next) => {
      if (req.isAuthenticated()) {
            res.locals.user = req.user;
      }
      return next();
}

export default passport;