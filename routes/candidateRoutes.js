const express = require('express')
const Candidate = require('../models/candidateModule')
const router = express.Router()
const mongoose = require('mongoose')

router.post('/signup', async (req, res) => {
    try {
        const data = req.body
        const newCandidate = new Candidate(data)
        newCandidate.save()

        res.status(201).json(newCandidate)
    } catch (error) {
        res.status(500).json({ error: "Server error" })
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
        res.status(500).json({ error: "Server error" })
    }
})

router.get('/list', async (req, res) => {
    try {
        const candidateList = await Candidate.find().select('name party').lean();
        res.status(200).json(candidateList)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
})

router.get('/vote-count', async (req, res) => {
    try {
        const candidateVoteCount = await Candidate.find().select('name party voteCount')
        res.status(200).json({ data:candidateVoteCount })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })

    }
})

router.put('/update/:candidate_id', async (req, res) => {
    try {
        const candidateId = req.params.candidate_id
        const updateData = req.body

        if( !mongoose.Types.ObjectId.isValid(candidateId)) {
            return res.status(400).json({ message: 'Invalid candidate ID' });
        }
        const updatedCandidateData = await Candidate.findByIdAndUpdate(candidateId, updateData,{ new:true, runValidators:true })
        if(!updatedCandidateData){
            return res.status(404).json({ message:'Candidate not found' });
        }

        res.status(200).json({ data:updatedCandidateData, message: "Candidate updated successfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
})

router.delete('/delete/:candidate_id', async (req, res) => {
    try {
        const candidateId = req.params.candidate_id
        if (!mongoose.Types.ObjectId.isValid(candidateId)) {
            return res.status(400).json({ message: 'Invalid candidate ID' });
        }

        const deletedCandidate = await Candidate.findByIdAndDelete(candidateId)
        if (!deletedCandidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Server error" })
    }
})

module.exports = router