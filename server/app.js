import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';

import indexRouter from '../routes/index.js';
import usersRouter from '../routes/users.js';
import apiRouter from '../routes/api.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine setup
app.set('views', path.join(path.resolve(), 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(path.resolve(), 'public')));
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);


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
  console.log('ERROR in app.js', err);
  res.send('error');
});

export default app;
