# Chatbot

Este proyecto es un asistente virtual que utiliza la API de Google Generative AI para responder a las preguntas del usuario y ejecutar programas en el sistema mediante accesos directos (.lnk).

## Requisitos

- Node.js
- Una clave de API de Google Generative AI
- Dependencias de Node.js (ver `package.json`)

## Instalación

1. Clona este repositorio:
   ```sh
   git clone https://github.com/tu-usuario/chatbot.git
   cd chatbot
   ```

2. Instala las dependencias:
   ```sh
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto y añade tu clave de API:
   ```properties
   API_KEY=tu_clave_de_api
   ```

## Uso

1. Asegúrate de tener accesos directos (.lnk) en la carpeta `Environment` en la raíz del proyecto.
2. Ejecuta el chatbot:
   ```sh
   node main.js
   ```

3. Interactúa con el asistente virtual a través de la línea de comandos. Puedes hacer preguntas y pedirle que ejecute programas utilizando el comando `RUN: nombre_del_programa`.

### Ejemplo

```
Hola, soy tu asistente virtual, ¿en qué puedo ayudarte?
Tú: ¿Qué archivos tengo en la carpeta Environment?
Asistente: Los archivos que tengo en la carpeta "Environment" son: ejemplo.lnk, otro_ejemplo.lnk.
Tú: RUN: ejemplo
Ejecutando programa: ejemplo
Programa ejemplo ejecutado con éxito.
¿En qué más puedo ayudarte?
```

## Dependencias

- `@google/generative-ai`
- `dotenv`
- `windows-shortcuts`
- `win-shortcut`

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.
