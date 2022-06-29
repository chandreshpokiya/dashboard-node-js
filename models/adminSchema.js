import mongoose from 'mongoose';

const AdminSchema = mongoose.Schema({
      username: {
            type: String,
            required: true,
            unique: true,
      },
      email: {
            type: String,
            required: true,
            unique: true,
      },
      password: {
            type: String,
            required: true,
      }
})

export default mongoose.model('Admin',AdminSchema)