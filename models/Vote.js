const mongoose = require('mongoose')

const Schema = mongoose.Schema

const VoteSchema = new Schema({
    voterId: { type: String, required: true },
    contestantId: { type: String, required: true },
    date: { type: Date, default: Date.now },
});


const Vote = mongoose.model('votes', VoteSchema);

module.exports = Vote
