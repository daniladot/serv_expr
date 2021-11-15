var express = require('express');
const {MongoClient} = require("mongodb");
var router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const fs = require("fs");

let users = null

const checkUserEmail = (email) => {
    return email.match(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i)
}

const checkUserName = (name) => {
    return name.match(/^[a-z0-9_-]{3,16}$/)
}

const checkUserAge = (age) => {
    return !isNaN(+age) && +age !== 0
}

const mongoConnect = async () => {
    const uri = "mongodb+srv://Julia2222:Julia2222@cluster0.reril.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect(err => {
        console.log('trying')
        users = client.db("myProject").collection("users");
        console.log('goood connection')
    });
}


const createEndpoints = () => {

    router.get('/', function (req, res, next) {
        const usersRes = users.find()
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: 'danil'
        }, 'secret');

        res.json(token);
    });

    router.post('/new-user-check', async function (req, res, next) {
        let check = await users.findOne({email: req.body.email})
        if (await bcrypt.compareSync(req.body.pass, check.pass)) {
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: 'foobar'
            }, 'secret');
            // console.log(token)
            await users.updateOne({email: req.body.email}, {$set: {token: token}})
            res.json(token);
        }
    })


    router.post('/new-user', async function (req, res, next) {

        const check = await users.find({email: req.body.email}).toArray()
        console.log(check)
        if (!check.length) {
            if (!checkUserEmail(req.body.email))
                res.json({status: 'incorrectly email', numStatus: 410});
            if (!checkUserName(req.body.name))
                res.json({status: 'incorrectly name', numStatus: 420});
            if (!checkUserAge(req.body.age))
                res.json({status: 'incorrectly age', numStatus: 430});
            if (!req.body.pass)
                res.json({status: 'incorrectly pass', numStatus: 440});
            if (checkUserEmail(req.body.email) && checkUserName(req.body.name) && checkUserAge(req.body.age) && req.body.pass) {
                const salt = bcrypt.genSaltSync(10);

                users.insertOne({
                    name: req.body.name,
                    age: req.body.age,
                    email: req.body.email,
                    pass: await bcrypt.hash(req.body.pass, salt).then((hash) => hash),
                    timestamp: Date.now()
                })
                res.json({status: 'user added successfully', numStatus: 200});
            }
        } else {
            res.json({status: 'such email exists', numStatus: 400});
        }

    });
}

const launch = async () => {
    await mongoConnect()
    await createEndpoints()
}

launch()

module.exports = router;
