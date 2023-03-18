const {MongoClient} = require('mongodb')
const express = require('express')
const uri = 'mongodb+srv://juliphyy:lJD1NJ04Ilhniw0A@cluster0.vpa0axs.mongodb.net/?retryWrites=true&w=majority'

const app = express()
const client = new MongoClient(uri);

app.get('/api', async function(req,res){
    let id = req.query.id;

    await client.connect()
    let db = client.db('magicdocs')
    let collection = db.collection('data')
    let result = await collection.find({id:id}).toArray()
    let userObject = result[0]

    res.send(JSON.stringify({fullname: userObject.fullname, name:userObject.firstname, birthdate: userObject.birthdate, passport_id: userObject.passport_id})   )
})

// {fullname: userObject.fullname, name:userObject.firstname, birthdate: userObject.birthdate, passport_id: userObject.passport_id}
app.listen(3132)