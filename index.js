const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
app.use(cors());
app.use(express.json());
const password = process.env.USER_PASSWORD;
console.log(password);

const uri = `mongodb+srv://resan6231:${password}@cluster0.absippg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("userDB");
    const crudUser = database.collection("crudUser");

    app.get("/users", async (req, res) => {
      const allUsers = crudUser.find();
      const result = await allUsers.toArray();
      res.send(result);
    });

    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await crudUser.insertOne(user);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("crud server is running in " + port);
});

app.listen(port);
