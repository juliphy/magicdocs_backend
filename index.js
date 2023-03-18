const {MongoClient} = require('mongodb')
const express = require('express')
const uri = 'mongodb+srv://juliphyy:lJD1NJ04Ilhniw0A@cluster0.vpa0axs.mongodb.net/?retryWrites=true&w=majority'

const app = express()
const client = new MongoClient(uri);

app.use(express.json(),);
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.post('/post', async function(req,res){
    info = req.body;
    console.log(info)

    try {
        await client.connect();
        const db = client.db("magicdocs");
        const collection = db.collection("data");
        const user = info;
        const result = await collection.insertOne(user);
    } catch(err) {
        console.log(err);
    } finally {
        await client.close();
    }

    res.sendStatus(200);
})


app.get('/page', async function(req,res){
    let id = req.query.id;
    try {
        await client.connect()
        let db = client.db('magicdocs')
        let collection = db.collection('data')
        let result = await collection.find({id:id}).toArray()
        res.send(result)
    } catch (err) {
        console.log(err)
    } finally {
        await client.close();
        console.log('Connection closed.')
    }
})

app.get('/tele', async function(req,res){
    let chatID = req.query.chatID;
    try {
        await client.connect()
        let db = client.db('magicdocs')
        let collection = db.collection('data')
        let result = await collection.find({chatID:chatID}).toArray()
        res.send(result)
    } catch (err) {
        console.log(err)
    } finally {
        await client.close();
        console.log('Connection closed.')
    }
})

// {fullname: userObject.fullname, name:userObject.firstname, birthdate: userObject.birthdate, passport_id: userObject.passport_id}
app.listen(3132)

module.exports = app;