import mongoose from 'mongoose';
import 'dotenv/config';



mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Remote 💽 Database connected'))
.catch(error => console.error(error));


const db = mongoose.connection;

export default db;