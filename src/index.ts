import * as net from 'node:net';
import { MongoClient } from 'mongodb';
import { FAVICON_DATASOURCE } from './favicon';
import express = require('express');

const uriString = process.env.PROD_DB_URI!; // Replace with your MongoDB connection URI
const port = process.env.PORT ?? 2628;
const client = new MongoClient(uriString);

interface Word {
  word: string;
  from?: string;
  definitions: Definition[];
}

interface Definition {
  text: string;
  shortenedWordType: string;
  ipa: string;
  example?: string;
}

const server = express();

async function main() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('sdml'); // Specify your database name if not in the connection URI
    const collection = database.collection<Word>('en'); // Specify your collection name ('en' for English)

    server.get('/', async (request, response) => {
      const word = request.query.word;
      if (typeof word !== 'string')
        response.status(200).contentType('text/html').send(`<html>
        <head>
          <meta charset="utf-8" />
            <title>The Santinian Dictionary of Modern Language</title>
            <style>body{font-family:system-ui;}@media(prefers-color-scheme:dark){body{background-color:black;color:white;}}</style>
  
            <link rel="icon" type="image/x-icon" href="${FAVICON_DATASOURCE}" />
        </head>
        <body>
          <h1>The Santinian Dictionary of Modern Language</h1>
            <p>Get accurate definitions of common Generation Alpha slang in seconds!</p>
            <form action="/" method="get">
                <input type="text"
                name="word" 
                placeholder="Type a slang word..." 
                style="padding:1.6pc 3.2pc;border-radius:50px"
                />
                <br />
                <br />
                <input type="submit" value="Submit" style="padding:1.6pc 3.2pc;border-radius:100px;color:white;background-color:#0056ff;" />
            </form>
        </body>
      </html>`);
      else {
        const query = String(word).trim().toLowerCase();
        const wordObject = await collection.findOne({ word: query });
        response.status(wordObject ? 200 : 404).contentType('text/html').send(`<html>
  <head>
    <meta charset="utf-8" />
      <title>The Santinian Dictionary of Modern Language</title>
      <style>body{font-family:system-ui;}@media(prefers-color-scheme:dark){body{background-color:black;color:white;}}</style>

      <link rel="icon" type="image/x-icon" href="${FAVICON_DATASOURCE}" />
  </head>
  <body>
    <h1>The Santinian Dictionary of Modern Language</h1>

    ${wordObject ? `<ol>
      ${wordObject.definitions.map(definition => `<li><strong>${word} (${definition.shortenedWordType})</strong> /${definition.ipa}/ <br /> ${wordObject.from ? `<div class="wrapper" style="width:40pc;"><p style="color:green;">${wordObject.from}</p></div>` : ''}<p>${definition.text}</p> ${definition.example ? `<p><strong>Example:</strong> ${definition.example}</p>` : ''}</li>`).join('\n')}
  
    </ol>` : `<p style="color: orange;">No definitions found for "${word}"</p>`}
  </body>
</html>`);
      }
    });

    
    server.listen(port, () => {
      console.log('SDML listening on: http://127.0.0.1:%d', port);
      // console.log('* DICT: dict://127.0.0.1:%d', port);
    });
  } finally {
    // Ensure the client is closed when you're finished
    // await client.close();
    // console.log('Connection to MongoDB closed');
  }
}

main().catch(console.error);
