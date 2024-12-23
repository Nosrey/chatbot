// filepath: /C:/Users/nosre/OneDrive/Documents/Github/Practica/chatbot/main.js
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const ws = require('windows-shortcuts'); // Módulo para resolver accesos directos en Windows

if (!process.env.API_KEY) {
    console.error('Error: API_KEY no está definido en las variables de entorno.');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

let model;

try {
    model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
} catch (error) {
    console.error('Error obteniendo el modelo generativo:', error);
    process.exit(1);
}

async function run() {
    const chat = model.startChat({
        generationConfig: { maxOutputTokens: 100 },
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true,
    });

    console.log('Hola, soy tu asistente virtual, ¿en qué puedo ayudarte?');

    rl.on('line', async (msg) => {
        if (msg.toLowerCase() === 'exit') {
            console.log('¡Adiós!');
            rl.close();
            return;
        }

        const prompt = "Eres un asistente virtual. Debes basar tus respuestas en el contexto de los archivos que tengo en la carpeta 'Environment'. Si te pido que ejecutes un programa, debes hacerlo mediante el comando 'RUN: nombre_del_programa'. ";

        let fileList;
        try {
            fileList = 'Los archivos que tengo en la carpeta "Environment" son: ';
            const files = fs.readdirSync(path.join(__dirname, 'Environment'));
            files.forEach(file => {
                fileList += file + ', ';
            });
            fileList = fileList.slice(0, -2) + '. ';
        } catch (error) {
            console.error('Error obteniendo la lista de archivos en la carpeta "Environment":', error);
            fileList = 'No pude obtener la lista de archivos en la carpeta "Environment". ';
        }

        try {
            const finalPrompt = prompt + fileList + msg;
            const result = await chat.sendMessage(finalPrompt);
            const response = await result.response;
            const modelResponse = await response.text();
            console.log('Asistente:', modelResponse);

            // Ejecutar un programa si el modelo genera el comando 'RUN:'
            if (modelResponse.startsWith('RUN:')) {
                let programName = modelResponse.slice(4).trim();
                console.log(`Ejecutando programa: ${programName}`);
                if (programName.includes('.lnk')) {
                    programName = programName.replace('.lnk', '');
                }
                const shortcutPath = path.join(__dirname, 'Environment', `${programName}.lnk`);
                console.log(`Ejecutando programa: ${shortcutPath}`);

                // Verificar si el acceso directo existe
                if (!fs.existsSync(shortcutPath)) {
                    console.error(`El acceso directo "${programName}" no existe.`);
                    return;
                }

                try {
                    // Resolver el destino del acceso directo
                    ws.query(shortcutPath, (err, opts) => {
                        if (err) {
                            console.error('Error al resolver el acceso directo:', err);
                            return;
                        }
                        const targetPath = opts.target;
                        console.log(`Ejecutando: ${targetPath}`);

                        // Ejecutar el archivo de destino
                        exec(`"${targetPath}"`, (error, stdout, stderr) => {
                            if (error) {
                                console.error(`Error al ejecutar el programa: ${error.message}`);
                                return;
                            }
                            console.log(`Programa ${programName} ejecutado con éxito.`);
                        });
                    });
                } catch (error) {
                    console.error('Error al resolver el acceso directo:', error);
                }
            }
        } catch (error) {
            console.error('Error obteniendo la respuesta del modelo generativo:', error);
        }

        // Vuelve a preguntar al usuario
        console.log('¿En qué más puedo ayudarte?');
    });
}

run();
