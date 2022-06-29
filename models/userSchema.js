import mongoose from 'mongoose';
import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
var __dirname = path.join(dirname(fileURLToPath(import.meta.url)));
const AVATAR_PATH = path.join('/uploads/admins/avatars')

const UserSchema = mongoose.Schema({
      name: {
            type: String,
            required: true,
      },
      email: {
            type: String,
            required: true,
            unique: true,
      },
      password: {
            type: String,
            required: true,
      },
      gender: {
            type: String,
            required: true,
      },
      hobby: {
            type: Array,
            required: true,
      },
      city: {
            type: String,
            required: true,
      },
      message: {
            type: String,
            required: true,
      },
      avatar: {
            type: String,
            required: true,
      },
})

let storage = multer.diskStorage({
      destination: (req, file, cb) => {
            cb(null, path.join(__dirname,'..',AVATAR_PATH));
      },
      filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      }
})

UserSchema.statics.uploadedAvatar = multer({storage: storage}).single('avatar');
UserSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', UserSchema);
export default User;