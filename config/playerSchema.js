import mongoose, { Schema } from 'mongoose';


const playerSchema = new mongoose.Schema({
    playerName : { type : String, unique : true, required : true},
    games : { type : Number },
    boughtIn : { type : Number },
    cashedOut : { type : Number },
    wonOrLost : { type : Number }
})


const Player = mongoose.model('Player', playerSchema);

export default Player;