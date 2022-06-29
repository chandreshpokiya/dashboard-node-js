import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const port = 8000;
const app = express();
import routes from './routes/index.js'
import flash from 'connect-flash';

import setFlash from './config/flashMiddleware.js'

import expressLayouts from 'express-ejs-layouts'

app.set('view engine', 'ejs')
app.set('views', path.join(dirname(fileURLToPath(import.meta.url)), 'views'))

import session from 'express-session';
import passport from 'passport';
import './config/passport-local-strategy.js'

app.use(expressLayouts);

app.use(express.urlencoded());
app.use(express.static('assets'))
app.use('/uploads', express.static('uploads'))

import './config/mongoose.js'

app.use(session({
      name: 'code',
      secret: 'something',
      saveUninitialized: false,
      resave: false,
      coolie: {
            maxAge: 1000 * 60 * 100
      }
}))

app.use(passport.session())
app.use(passport.initialize())
 
app.use(passport.setAuthenticatedUser)

app.use(flash())
app.use(setFlash);

app.use('/', routes)

app.listen(port, (err) => {
      if (err) {
            console.log(err);
            return false;
      }
      console.log('server listening on http://localhost:%d', port);
})