const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const pug = require('pug');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();

const pageRouter = require('./routes/page');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const uploadRouter = require('./routes/upload');

const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

sequelize.sync({ force: false })
  .then(() => {
    console.log('db connection success');
  })
  .catch((err) => {
    console.error(err);
  });

passportConfig();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/docu', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cookieParser(process.env.COOKIE));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/upload', uploadRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log('listening on', app.get('port'));
});
