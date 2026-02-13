const express = require('express')
const router = express.Router()
const { authentication } = require('../middlewares/authentication')
const multer = require('../middlewares/multer')
const VoterModel = require('../models/VoterSchema')

router.post('/postVoterImage', authentication, multer.uploadVoter, async (req, res) => {
  try {
    const accountAddress = req.accountAddress
    const imageName = req.file && req.file.filename

    if (!imageName) {
      return res.status(400).json({ message: 'Image file is required' })
    }

    await VoterModel.create({
      accountAddress,
      imageName,
    })

    return res.status(200).json({ message: 'successful' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Failed to upload voter image' })
  }
})

module.exports = router;
