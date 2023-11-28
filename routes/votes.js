const express = require('express')
const router = express.Router()
const Pusher = require('pusher');
const verifyToken = require('../verifyToken')
const Vote = require('../models/Vote')
const User = require('../models/User')
const { socket } = require('../config/websocket')

router.get('/', async (req, res) => {
    const contestants = await User.find({ role: 'CONTESTANT' })
    const voteDetails = []
    let totalVotes = 0;

    for (let contestant of contestants) {
        const id = contestant._id;

        // console.log(contestant.firstname)
        // console.log(id)
        const count = await Vote.count({ contestantId: id })
        // console.log(count)
        voteDetails.push({
            contestantId: id,
            firstname: contestant.firstname,
            lastname: contestant.lastname,
            count: count
        })
        totalVotes += count

    }


    res.status(200).send({
        votes: voteDetails,
        totalVotes: totalVotes
    })
})

router.post('/', async (req, res) => {
    const contestantId = req.body.contestantId
    const voterId = req.body.voterId
    const point = req.body.point

    // const contestant = await User.findById({ _id: contestantId })
    // console.log(contestant)

    // if (contestant == null) {
    //     return res.status(400).send({
    //         contestantId: contestantId,
    //         message: `Contestant with id ${contestantId} does not exist`
    //     })
    // }

    // const voter = await Vote.findOne({ voterId: voterId })
    // if (voter) {
    //     return res.status(400).send({
    //         message: 'You already voted!'
    //     })
    // }


    const newVote = {
        voterId: voterId,
        contestantId: contestantId,
        point: point
    }

    new Vote(newVote).save()
        .then(response => {
            socket.emit("vote", {
                success: true,
                message: "Vote saved!",
                vote: response
            })
        }).catch(err => res.json(err))

})



module.exports = router