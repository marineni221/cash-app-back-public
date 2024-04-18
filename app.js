require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/users.route');
const rolesRouter = require('./src/routes/roles.route');
const authRouter = require('./src/routes/auth.route');
const verificationRouter = require('./src/routes/otp-verification.route');
const refreshTokenRouter = require('./src/routes/refresh-token.route');
const otpRouter = require('./src/routes/otp.route');
const campaignRouter = require('./src/routes/campaign.route');
const verifyToken = require('./src/middleware/verify-jwt');
const formData = require("express-form-data");
const os = require("os");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000", "http://localhost:5173"]
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};

// parse data with connect-multiparty. 
app.use(formData.parse(options));
// delete from the request all empty files (size == 0)
app.use(formData.format());
// change the file objects to fs.ReadStream 
// app.use(formData.stream());
// union the body and the files
app.use(formData.union());

// =================================================================
                      /** Routes */

// const token_secret = require('crypto').randomBytes(64).toString('hex');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use('/', indexRouter);
app.use('/', refreshTokenRouter);
app.use('/', verificationRouter);
app.use('/otp', otpRouter);

app.get('/token', verifyToken, (req, res, next) => {
  res.status(200).json({message: 'Token was successfully verified.'});
});

app.use('/users', usersRouter);
app.use('/roles', rolesRouter);
app.use('/auth', authRouter);
app.use('/campaigns', campaignRouter);

// =================================================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({message: err.message, status: err.status, stack: err.stack.split('\n')});
});

module.exports = app;
