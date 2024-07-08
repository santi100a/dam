import * as net from 'node:net';
import { MongoClient } from 'mongodb';
import { FAVICON_DATASOURCE } from './favicon';

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

async function main() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('sdml'); // Specify your database name if not in the connection URI
    const collection = database.collection<Word>('en'); // Specify your collection name ('en' for English)

    const server = net.createServer((socket) => {
      socket.on('data', async (data) => {
        const requests = data.toString().trim().split('\r\n');
        console.log('A client has connected.');
        for (const request of requests) {
          if (requests[0].includes('HTTP/')) {
            const [, hostlessUrl] = requests[0].split(' ');
            if (hostlessUrl.trim() == '/') {
              socket.write('HTTP/1.1 200 OK');
              socket.write('\r\n');
              socket.write('Content-Type: text/html');
              socket.write('\r\n');
              socket.write('\r\n'); // Blank line
              socket.write('<html>');
              socket.write('<head>');
              socket.write('<meta charset="utf-8" />');
              socket.write(
                `<title>The Santinian Dictionary of Modern Language</title>`
              );
              socket.write(
                '<style>body{font-family:system-ui;}@media(prefers-color-scheme:dark){body{background-color:black;color:white;}}</style>'
              );
              socket.write(`<link rel="icon" type="image/x-icon" href="${FAVICON_DATASOURCE}" />`);
              socket.write('</head>');
              socket.write('<body>');
              socket.write(
                '<h1>The Santinian Dictionary of Modern Language</h1>'
              );
              socket.write('<form action="/" method="get">');
              socket.write(
                '<input type="text" name="word" placeholder="Write a slang word..." style="padding:1.6pc 3.2pc;border-radius:50px"/><br />'
              );
              socket.write('<br />');
              socket.write('<input type="submit" value="Submit" style="padding:1.6pc 3.2pc;border-radius:100px;color:white;background-color:#0056ff;" />');
              socket.write('</form>');
              socket.write('</body>');
              socket.write('</html>');
              socket.end();
            } else {
              const parsedUrl = new URL(`http://localhost${hostlessUrl}`);
              const queryParameters = parsedUrl.searchParams;

              // Example: Accessing query parameters
              const word = queryParameters.get('word');
              if (word) {
                console.log(`Word query parameter found: ${word}`);
                const wordObject = await collection.findOne({ word });
                if (wordObject) {
                  socket.write('HTTP/1.1 200 OK');
                  socket.write('\r\n');
                  socket.write('Content-Type: text/html');
                  socket.write('\r\n');
                  socket.write('\r\n');
                  socket.write('<html>');
                  socket.write('<head>');
                  socket.write('<meta charset="utf-8" />');
                  socket.write(`<link rel="icon" type="image/x-icon" href="${FAVICON_DATASOURCE}" />`);
                  socket.write(`<title>SDML - Results for "${word}"</title>`);
                  socket.write(
                    '<style>body{font-family:system-ui;}div.wrapper{background-color:#f0f0f0}@media(prefers-color-scheme:dark){body{background-color:black;color:white;}div.wrapper{background-color: #2d2d2d;}}</style>'
                  );
                  socket.write('</head>');
                  socket.write('<body>');
                  socket.write(
                    '<h1>The Santinian Dictionary of Modern Language</h1>'
                  );
                  socket.write(`<ol>`);
                  for (const definition of wordObject.definitions) {
                    socket.write('<li>');
                    socket.write(
                      `<strong>${word} (${definition.shortenedWordType})</strong> /${definition.ipa}/ <br />`
                    );
                    
                    if (wordObject.from) {
                      socket.write(`<div class="wrapper" style="width:40pc;">`);
                      socket.write(`<p style="color:green;">${wordObject.from}</p>`);
                      socket.write(`</div>`);
                    }
                    socket.write(`<p>${definition.text}</p>`);
                    if (definition.example)
                      socket.write(`<p><strong>Example:</strong> ${definition.example}</p>`);
                    socket.write('</li>');
                  }
                  socket.write(`</ol>`);
                  socket.write('</body>');
                  socket.write('</html>');
                } else {
                  socket.write('HTTP/1.1 404 Not Found');
                  socket.write('\r\n');
                  socket.write('Content-Type: text/html');
                  socket.write('\r\n');
                  socket.write('\r\n');
                  socket.write('<html>');
                  socket.write('<head>');
                  socket.write('<meta charset="utf-8" />');
                  socket.write(`<link rel="icon" type="image/x-icon" href="${FAVICON_DATASOURCE}" />`);
                  socket.write(
                    `<title>The Santinian Dictionary of Modern Language</title>`
                  );
                  socket.write(
                    '<style>body{font-family:system-ui;}@media(prefers-color-scheme:dark){body{background-color:black;color:white;}}</style>'
                  );
                  socket.write('</head>');
                  socket.write('<body>');
                  socket.write(
                    '<h1>The Santinian Dictionary of Modern Language</h1>'
                  );
                  socket.write(
                    `<p style="color: orange;">No definitions found for "${word}"</p>`
                  );
                  socket.write('</body>');
                  socket.write('</html>');
                }
              } else {
                // Handle cases where specific query parameters are missing or invalid
                console.log('No valid query parameters found');
              }
              socket.end();
            }
            return;
          }
          console.log(`DICT client request: ${request}`);

          const commandArgs = request.split(' ');
          const command = commandArgs[0].toUpperCase();

          switch (command) {
            case 'CLIENT':
            case 'HELLO':
              socket.write(
                `220 - SDML "The Santinian Dictionary of Modern Language" v1.0\r\nSend word suggestions to [hyper.industries+sdml@protonmail.com]\r\n`
              );
              break;
            case 'DEFINE':
              const word = commandArgs[2]; // Third argument (DEFINE, [database], *[word]*)
              let index = 1;
              try {
                const wordObject = await collection.findOne({ word });
                if (wordObject) {
                  socket.write('250 - OK\r\n');
                  socket.write(
                    `150 - Found ${wordObject.definitions.length} definition(s) for "${word}":\r\n`
                  );
                  for (const definition of wordObject.definitions) {
                    socket.write(
                      `${index}. ${word} (${definition.shortenedWordType}) /${definition.ipa}/\r\n`
                    );
                    if (wordObject.from) {
                      socket.write(`   ${wordObject.from}\r\n`);
                    }

                    socket.write(
                      `   ${definition.text.replace('\r\n', '\r\n   ')}\r\n`
                    );
                    if (definition.example) {
                      socket.write(`   EXAMPLE: ${definition.example}\r\n`);
                    }
                    socket.write('\r\n'); // End of definition
                    index++;
                  }
                } else {
                  socket.write(`552 - No definitions found for "${word}"\r\n`);
                }
              } catch (error) {
                console.error('Error querying MongoDB:', error);
                socket.write(`500 - Internal Server Error\r\n`);
              }
              break;
            case 'QUIT':
              socket.write(`221 - Bye\r\n`);
              socket.end();
              break;
            default:
              socket.write(`500 - Unknown command\r\n`);
          }
        }
      });

      socket.on('end', () => {
        console.log('A client has disconnected.');
      });
    });

    server.listen(port, () => {
      console.log('SDML listening on:');
      console.log('* HTTP: http://127.0.0.1:%d', port);
      console.log('* DICT: dict://127.0.0.1:%d', port);
    });
  } finally {
    // Ensure the client is closed when you're finished
    // await client.close();
    // console.log('Connection to MongoDB closed');
  }
}

main().catch(console.error);
