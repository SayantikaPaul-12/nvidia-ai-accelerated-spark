import express from 'express';
import gradioProxy from './gradioProxy.mjs';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/.netlify/functions', gradioProxy);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
