const {MongoClient} = require('mongodb')
const express = require('express')
const uri = 'mongodb+srv://juliphyy:l7jOBx88bEV9kvw5@cluster0.vpa0axs.mongodb.net/?retryWrites=true&w=majority'

const form_data = require('form-data')

const app = express()
const client = new MongoClient(uri);
const API_KEY = "d2f5768f8798f57a63d32ddd6a4e9f8e";

app.use(express.json(),);
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/page', async function(req,res){
    let id = req.query.id;
    try {
        await client.connect()

        let db = client.db('magicdocs')
        let collection = db.collection('data')

        let result = await collection.find({id:id}).toArray()
        console.log(result)
        res.send(result)
    } catch (err) {
        console.log(err)
    } finally {
        await client.close();
        console.log('Connection closed.')
    }
})

app.get('/exist', async function(req,res){
    let id = req.query.id;
    try {
        await client.connect()

        let db = client.db('magicdocs')
        let collection = db.collection('data')

        let result = await collection.find({"id":id}).toArray()
        var endResult = result[0]

        if (endResult == undefined) {
            res.sendStatus(404)
        } else { 
            res.sendStatus(200)
        }

    } catch (err) {
        console.log(err)
    } finally {
        await client.close();
        console.log('Connection closed.')
    }
})

app.get('/login', async function(req,res){
    let id = req.query.id;
    try {
        await client.connect();

        let db = client.db('magicdocs');
        let collection = db.collection('data');
        let settings = db.collection('settings');

        let result = await collection.find({id:id}).toArray();
        let settingsResult = await settings.find({}).toArray();
        var endResult = result[0];
        var endSettingsResult = settingsResult[0];

        res.send({isAdmin: endResult.status.isAdmin, isLoginAllowed: endSettingsResult.allowLogin});

    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
        console.log('Connection closed.')
    }
})

app.post('/sign', async (req, res) => {
    try {

        const id = req.query.id;

        const base64data = req.body.image;

        let form = new FormData();

        form.append('image', base64data)

        const response = await axios.post(
            'https://api.imgbb.com/1/upload?key=' + API_KEY,
            form,
            }
          );

        const url = response.data.data.url;

        let db = client.db('magicdocs');
        let collection = db.collection('data');

        const result = collection.updateOne(
            {"id": id},
            {"$set": {
                "img.urlSign": url
            }}
        )
        console.log("DB Response")
        console.log(result)
        
        res.sendStatus(200)
          
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send('Error uploading image');
    }
});




// {fullname: userObject.fullname, name:userObject.firstname, birthdate: userObject.birthdate, passport_id: userObject.passport_id}
app.listen(3132)
