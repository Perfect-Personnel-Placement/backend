import { Client } from 'pg'

const client = new Client({ 
    host: process.env.RDS_URL, 
    user: process.env.RDS_USER, 
    password: process.env.RDS_PASSWORD,
    database: "P3_Database"
})

client.connect();

export default client;
