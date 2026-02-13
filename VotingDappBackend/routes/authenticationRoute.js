const express = require('express')
const router = express.Router()
const { ethers } = require('ethers')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const { OAuth2Client } = require('google-auth-library')

// POST /api/authentication: existing Ethereum signature auth
router.post('/authentication', async (req, res) => {
  try {
    const { accountAddress } = req.query
    const { signature } = req.body

    if (!accountAddress || !signature) {
      return res.status(400).json({ message: 'accountAddress query param and signature are required' })
    }

    if (!ethers.isAddress(accountAddress)) {
      return res.status(400).json({ message: 'Invalid account address' })
    }

    const message = 'Welcome to Voting Dapp. You accept our terms and condition'
    const recoveredAddress = ethers.verifyMessage(message, signature)

    if (ethers.getAddress(recoveredAddress) !== ethers.getAddress(accountAddress)) {
      return res.status(401).json({ message: 'Authentication failed' })
    }

    const token = jwt.sign(
      { accountAddress: ethers.getAddress(accountAddress) },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '1h' }
    )

    return res.status(200).json({ message: 'Authentication Successful', token })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Authentication failed' })
  }
})

// GET /api/auth/google -> redirect user to Google's OAuth consent screen
router.get('/auth/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/auth/google/callback`
  if (!clientId) {
    return res.status(500).send('Google client ID not configured on server')
  }

  const scope = encodeURIComponent('profile email')
  const state = encodeURIComponent(req.query.next || '/')
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${state}`
  return res.redirect(authUrl)
})

// GET /api/auth/google/callback -> exchange code, verify id_token and issue our JWT, then redirect to frontend with token
router.get('/auth/google/callback', async (req, res) => {
  try {
    const code = req.query.code
    const state = req.query.state || '/'
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/auth/google/callback`

    if (!code) return res.status(400).send('Missing code')
    if (!clientId || !clientSecret) return res.status(500).send('Google OAuth not configured')

    // Exchange code for tokens
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    const { id_token } = tokenRes.data
    if (!id_token) return res.status(500).send('Failed to obtain id_token from Google')

    // Verify id_token
    const client = new OAuth2Client(clientId)
    const ticket = await client.verifyIdToken({ idToken: id_token, audience: clientId })
    const payload = ticket.getPayload()

    // Create our app JWT
    const token = jwt.sign(
      { provider: 'google', sub: payload.sub, email: payload.email, name: payload.name },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '1h' }
    )

    // Redirect back to front-end (state) with token as query param
    const frontendRedirect = process.env.FRONTEND_URL || 'http://localhost:5173'
    const target = `${frontendRedirect}${state.startsWith('/') ? state : '/'}?token=${encodeURIComponent(token)}`
    return res.redirect(target)
  } catch (error) {
    console.error('Google callback error', error?.response?.data || error.message || error)
    return res.status(500).send('Google authentication failed')
  }
})

module.exports = router