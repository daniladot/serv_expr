var express = require('express');
var router = express.Router();
const {MongoClient} = require('mongodb');

let englishWords = null
let themes = null




const mongoConnect = async () => {
    const uri = "mongodb+srv://Julia2222:Julia2222@cluster0.reril.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect(async err => {
        console.log('trying')
        englishWords = client.db("myProject").collection("englishWords");
        themes = client.db("myProject").collection("themes");
        console.log('goood connection')
    });

}

const createEndpoints = async () => {
    /* GET home page. */
    router.get("/", async (req, res) => {
        const response = await englishWords.find().toArray()
            .catch(err => console.error(`Failed to find documents: ${err}`))
        res.json(response);
    })

    router.get("/body", async (req, res) => {
        const response = await englishWords.find({theme: 'body'}).toArray()
            .catch(err => console.error(`Failed to find documents: ${err}`))
        res.json(response);
    })
    router.get("/appearance-and-character", async (req, res) => {
        const response = await englishWords.find({theme: 'Appearance and character'}).toArray()
            .catch(err => console.error(`Failed to find documents: ${err}`))
        res.json(response);
    })
    router.get("/dishes", async (req, res) => {
        const response = await englishWords.find({theme: 'dishes'}).toArray()
            .catch(err => console.error(`Failed to find documents: ${err}`))
        res.json(response);
    })
    router.get("/home", async (req, res) => {
        const response = await englishWords.find({theme: 'home'}).toArray()
            .catch(err => console.error(`Failed to find documents: ${err}`))
        res.json(response);
    })
    router.get("/themes", async (req, res) => {
        const response = await themes.find().toArray()
            .catch(err => console.error(`Failed to find documents: ${err}`))
        res.json(response);
    })
}

const launch = async () => {
    await mongoConnect()
    await createEndpoints()
}

launch()


module.exports = router;
