const router = require('express').Router()
const User = require('../models/User')
const Vote = require('../models/Vote')

router.get('/contestants', async (req, res) => {
    const contestants = await User.find({ role: 'CONTESTANT' })

    res.status(200).send({
        contestants: contestants
    })
})


router.get('/contestants/details', async (req, res) => {
    const contestants = await User.find({ role: 'CONTESTANT' })
    const voteDetails = []
    let totalVotes = 0;

    for(let contestant of contestants) {
        const id = contestant._id;

        console.log(contestant.firstname)
        console.log(id)
        const count = await Vote.count({ contestantId: id })
        console.log(count)
        voteDetails.push({
            id: id,
            firstname: contestant.firstname,
            lastname: contestant.lastname,
            totalVotes: count  
        })
        totalVotes += count
        
    }


    res.status(200).send({
        contestants: voteDetails,
        totalVotes: totalVotes
    })
})


module.exports = router