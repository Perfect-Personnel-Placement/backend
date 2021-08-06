import { Client } from 'pg';
const client = new Client({
  host: process.env.RDS_URL,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD
});

export default client;
