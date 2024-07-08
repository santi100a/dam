async function dict(socket: import('node:net').Socket, request: string, collection: any) {
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