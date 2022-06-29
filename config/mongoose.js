import mongoose from 'mongoose'

mongoose.connect('mongodb://0.0.0.0:27017/dashboard')

const db = mongoose.connection

db.on('error',console.error.bind(console,'db is not connected'))

db.once('open',(err)=>{
      if(err){
            console.log(err);
            return false;
      }
      console.log('db is connected db name is dashboard');
})

export default db