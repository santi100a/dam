import { MongoClient } from 'mongodb';
import { FAVICON_DATASOURCE } from './favicon';
import express = require('express');
import compression = require('compression');

const uriString = process.env.PROD_DB_URI!;
const port = process.env.PORT ?? 3000;
const client = new MongoClient(uriString);
const title = 'Diccionario de Argot Moderno';
const contactEmail = 'santyrojasprieto9+sdml@gmail.com';

interface Word {
  word: string;
  from?: string;
  ipa: string;
  definitions: Definition[];
}

interface Definition {
  text: string;
  shortenedWordType: string;
  example?: string;
}

const server = express();
server.use(compression());
async function main() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('sdml');
    const collection = database.collection<Word>('es');

    server.get('/', async (request, response) => {
      const word = String(request.query.word).trim().toLowerCase();
      if (request.query.word == undefined || word === '')
        response
          .status(200)
          .contentType('text/html')
          .send(
            `<!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <meta name="description" content="Un diccionario de jerga adolescente en línea, rápido y minimalista." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>${title}</title>
            <style>body{font-family:system-ui;}@media(prefers-color-scheme:dark){body{background-color:black;color:white;}}</style>
  
            <link rel="icon" type="image/x-icon" href="${FAVICON_DATASOURCE}" />
        </head>
        <body>
          <h1>${title}</h1>
            <p>Consulta definiciones de palabras de generación Z o alfa</p>
            <form action="/" method="get">
                <input type="text"
                required
                name="word" 
                placeholder="Escribe una palabra..." 
                style="padding: 1pc 1pc;border-radius:50px;font-family:inherit;"
                />
                <input type="submit"
                value="Consultar" 
                style="padding: 1.1pc 3pc;border-radius:100px;color:white;background-color:#0056ff;font-family:inherit;" 
                />
            </form>
        </body>
      </html>`
          );
      else {
        const wordObject = await collection.findOne({ word });
        response
          .status(wordObject ? 200 : 404)
          .contentType('text/html')
          .send(
            `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="description" content="Un diccionario de jerga adolescente en línea, rápido y minimalista." />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
      <style>body{font-family:system-ui;}a{color:#587edb;}.from{color:#006100;background-color:#f7f7f7;}@media(prefers-color-scheme:dark){body{background-color:black;color:white;}.from{color:#00db00;background-color:#2e2e2e;}}</style>

      <link rel="icon" type="image/x-icon" href="${FAVICON_DATASOURCE}" />
  </head>
  <body>
    <h1>${title}</h1>

    ${
      wordObject
        ? `
        <strong>${word} </strong> /${wordObject.ipa}/ <br /> ${
            wordObject.from
              ? `<span class="from">${wordObject.from}</span>`
              : ''
          }
        <ol>
      ${wordObject.definitions
        .map(
          (definition, index) =>
            `<li id="${index + 1}"> <p><span style="color:#587edb;">${
              definition.shortenedWordType
            }</span> ${definition.text}</p> ${
              definition.example
                ? `<p><strong>Ejemplo:</strong> ${definition.example}</p>`
                : ''
            }</li>`
        )
        .join('\n')}
  
    </ol>
    <hr /> <p>¡Envía sugerencias a <a href="mailto:${contactEmail}">${contactEmail}</a>!</p>`
        : `<p style="color: orange;">La palabra "${word}" no está en el diccionario.</p>
          ¡Envía sugerencias a <a href="mailto:${contactEmail}">${contactEmail}</a>!`
    }
  </body>
</html>`
          );
      }
    });

    server.listen(port, () => {
      console.log('Listening on: http://127.0.0.1:%d', port);
    });
  } finally {
  }
}

main().catch(console.error);
