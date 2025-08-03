const express = require('express')
const Candidate = require('../models/candidateModule')
const router = express.Router()

router.post('/signup', async (req, res) => {
    try {
        const data = req.body
        const newCandidate = new Candidate(data)
        newCandidate.save()

        res.status(201).json(newCandidate)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
})

router.get('/profile/:candidate_id', async (req, res) => {
    try {
        const candidateId = req.params.candidate_id
        const candidateData = await Candidate.findById(candidateId)
        if (candidateData === "" || candidateData === undefined) {
            res.status(401).json({ error: error, message: "Candidate not found" })
        }
        res.status(200).json({ candidateData })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
})

router.get('/list', async (req, res) => {
    try {
        const candidateList = await Candidate.find().select('name party').lean();
        res.status(200).json(candidateList)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
})

router.get('/vote-count', async (req, res) => {
    try {
        const candidateVoteCount = await Candidate.find().select('name party voteCount')
        res.status(200).json({ data:candidateVoteCount })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })

    }
})


module.exports = router