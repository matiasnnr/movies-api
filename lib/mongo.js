const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config')

const DB_USER = encodeURIComponent(config.dbUser);
const DB_PASSWORD = encodeURIComponent(config.dbPassword);
const DB_NAME = encodeURIComponent(config.dbName);

// const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${config.dbHost}:${config.port}/${DB_NAME}?retryWrites=true&w=majority`;
const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${config.dbHost}/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib {
    constructor() {
        this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
        this.dbName = DB_NAME;
    }

    connect() { // Singleton 
        if (!MongoLib.connection) { // Si no existe una conexión
            MongoLib.connection = new Promise((resolve, reject) => {
                this.client.connect(err => {
                    if (err) {
                        reject(err);
                    }

                    console.log('Connected succesfully to MongoDB');
                    resolve(this.client.db(this.dbName));
                })
            })
        }

        return MongoLib.connection; // Si existe una conexión
    }

    getAll(collection, query) {
        return this.connect().then(db => {
            return db.collection(collection).find(query).toArray();
        })
    }

    get(collection, id) {
        return this.connect().then(db => {
            return db.collection(collection).findOne({ _id: ObjectId(id) });
        })
    }

    create(collection, data) {
        return this.connect().then(db => {
            return db.collection(collection).insertOne(data);
        }).then(result => result.insertId)
    }

    update(collection, id, data) {
        return this.connect().then(db => {
            return db.collection(collection).updateOne({ _id: ObjectId(id) }, { $set: data }, { upsert: true });
        }).then(result => result.upsertedId || id)
    }

    delete(collection, id) {
        return this.connect().then(db => {
            return db.collection(collection).deleteOne({ _id: ObjectId(id) });
        }).then(() => id)
    }
}

module.exports = MongoLib;

