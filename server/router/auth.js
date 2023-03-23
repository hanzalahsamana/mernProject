const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../model/userSchema')

require('../db/conn')

router.get('/', (req, res) => {
    res.send('Hello world from the router server')
})


router.post('/register', async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;
    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: 'Please filled all the fields' })
    }
    try {
        const userExist = await User.findOne({ email: email })
        console.log("userExist", userExist)
        if (userExist) {
            return res.status(422).json({ error: 'Email already exist' })
        } else if (password !== cpassword) {
            return res.status(422).json({ error: 'Password are not matching!' })
        } else {
            const user = new User({ name, email, phone, work, password, cpassword });
            await user.save()
            res.status(200).json({ message: "user registered successfully" })
        }
    } catch (err) {
        console.log(err)
    }
});

router.post('/signin', async (req, res) => {
    try {
        let token;
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({ error: 'Please filled all the fields' })
        }
        const userLogin = await User.findOne({ email: email });
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password)
            token = await userLogin.generateAuthToken();
            console.log("token", token)

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })
            if (!isMatch) {
                res.status(400).json({ error: "Inavalid password" })
            } else {
                res.status(400).json({ error: "user signin successfully" })
            }
        } else {
            res.status(200).json({ message: "invalid credientials!" })
        }
    } catch (err) {
        console.log(err)
    }
});

module.exports = router;