import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to environment variables')
}

const uri = process.env.MONGODB_URI
const options = {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
}

let client
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient>
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri!, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri!, options)
  clientPromise = client.connect()
}

export default clientPromise