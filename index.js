import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs'

import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import checkAuth from './utils/checkAuth.js';

import { register, login, getMe } from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js'
import handleValidationErrors from './utils/handleValidationErrors.js';

// mongoose.connect('mongodb+srv://ogonick:ogonick@cluster0.kaj4xt4.mongodb.net/?retryWrites=true&w=majority')
mongoose.connect(process.env.MONGODB_URI)
.then(()=> {
  console.log('db Ok')
})
.catch((err) => console.log('db error'));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());

app.use(cors())

app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, login )

app.post('/auth/register', registerValidation, handleValidationErrors, register);

app.get('/auth/me', checkAuth, getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});


app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id',checkAuth, handleValidationErrors, PostController.update);

app.listen(process.env.PORT || 4444, (err)=> {
  if (err ) {
    return console.log(err);
  }

  console.log("server OK")
});