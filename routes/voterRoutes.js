const mongoose = require('mongoose')
const express = require('express')
const Voter = require('../models/voterModule')
const Candidate = require('../models/candidateModule')
const { generateToken, jwtAuthMiddleware } = require('../jwt')
const router = express.Router()


router.post('/signup', async (req, res) => {
    try {
        const data = req.body
        const newVoter = new Voter(data)
        await newVoter.save() // very very important to save the new voter

        res.status(201).json(newVoter)
    }catch (error) {
        if (error.name === "ValidationError") {
            // send detailed validation errors
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ errors: messages });
        }
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
})

router.post('/login',async (req, res) => {
    try {
        const { aadharNumber, password } = req.body
        const voterData = await Voter.findOne({ aadharNumber:aadharNumber })

        if (!voterData) {
            return res.status(401).json({ message: "Invalid Aadhar Number or Password" })
        }
        const isMatch = await voterData.comparePassword(password)
        if(!voterData || !isMatch ){
            return res.status(401).json({ message: "Invalid Aadhar Number or Password" })
        }

        const payload = {
            id: voterData._id,
        }
        const token = generateToken(payload)

        res.status(200).json({
            message: "Login successful",
            token: token,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
})

router.get('/profile/:id', jwtAuthMiddleware,async (req, res) => {
    try {
        const voterId = req.params.id
        const allVoterList = await Voter.findById(voterId)
        res.status(200).json(allVoterList)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
})

router.post('/vote/:candidate_id', jwtAuthMiddleware,async (req, res) => {
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
        res.status(500).json({ error: "Server error" })
    }
})

module.exports = router