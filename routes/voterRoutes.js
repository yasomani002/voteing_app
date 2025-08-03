const mongoose = require('mongoose')
const express = require('express')
const Voter = require('../models/voterModule')
const Candidate = require('../models/candidateModule')
const router = express.Router()


router.post('/signup', async (req, res) => {
    try {
        const data = req.body
        const newVoter = new Voter(data)
        newVoter.save()

        res.status(201).json(newVoter)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
})

router.get('/profile/:id', async (req, res) => {
    try {
        const voterId = req.params.id
        const allVoterList = await Voter.findById(voterId)
        res.status(200).json(allVoterList)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
})

router.post('/vote/:candidate_id', async (req, res) => {
    try {
        const voterId = req.body.voter_id
        const candidateId = req.params.candidate_id

        if (!mongoose.Types.ObjectId.isValid(voterId)) {
            return res.status(400).json({ message: 'Invalid voter ID' });
        }

        if (!mongoose.Types.ObjectId.isValid(candidateId)) {
            return res.status(400).json({ message: 'Invalid candidate ID' });
        }

        const voterData = await Voter.findById(voterId)

        if (!voterData.isVoted) {
            return res.status(401).json({ message: "You already voted" })
        }
        if (voterData.role === "admin") {
            return res.status(401).json({ message: "Admin dont have right to vote" })
        }

        
        const candidateData = await Candidate.findById(candidateId)
        if(!candidateData){
            return res.status(401).json({ message: "Candidate Id is wrong" })
        }

        candidateData?.votes?.push({ user: voterId })
        candidateData.voteCount++;
        candidateData.save()
        return res.status(200).json({ message: 'Vote recorded successfully' });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
})

module.exports = router