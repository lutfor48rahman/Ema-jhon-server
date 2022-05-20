const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000 ;
const app = express();



//middleware

app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mbsfz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        await client.connect();
        const productCollection = client.db('emaJohn').collection('product');


        app.get('/product',async(req,res)=>{
            console.log('query',req.query);
            //page work
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            const query = {};
            const cursor = productCollection.find(query);

            let product;
            if (page || size){

                product = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                product = await cursor.toArray();
            }
            res.send(product);
        });

        app.get('/productCount',async(req,res)=>{
            const count = await productCollection.estimatedDocumentCount();
            res.send({count});
        });

    // order quantity setup
    app.post('/productByKeys',async(req,res)=>{
        const keys = req.body;
        const ids = keys.map(id=>ObjectId(id));
        const query = {_id: {$in: ids}};
        const cursor = productCollection.find(query);
        const products = await cursor.toArray();
        res.send(products);
        console.log(keys);
    });
    }

    finally{

    }
}

run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Emajohn server started');
});


app.listen(port,()=>{
    console.log('Emajohn server running port is : ',port);
})