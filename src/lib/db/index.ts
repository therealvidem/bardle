import type { IDatabase } from '$lib/types';
import { MongoClient } from 'mongodb';
import { MongoDB } from './mongodb';
import { env } from '$lib/env';

const uri = env.MONGODB_URI;

if (!uri) {
	throw new Error('Could not find URI');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (env.NODE_ENV === 'development') {
	if (!global._mongoClientPromise) {
		client = new MongoClient(uri);
		global._mongoClientPromise = client.connect();
	}

	clientPromise = global._mongoClientPromise;
} else {
	client = new MongoClient(uri);
	clientPromise = client.connect();
}

export const db: IDatabase = new MongoDB(clientPromise);