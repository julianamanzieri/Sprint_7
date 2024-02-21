# API Chat

Es una aplicación que muestre una página de login donde el usuario pueda entrar en una sala de chat. Abriendo la misma URL en otra ventana del navegador podremos hacer login con otro usuario. Verifica que están en la misma sala y permite que chateen. Añade la posibilidad de crear múltiples salas de chat y gestiona la persistencia con MongoDB (con Mongoose).

## Instalación y Uso

### Requisitos

Hace falta tener instalado Docker.

Para obtener una copia local en funcionamiento, sigue estos pasos:

1. Clona el repositorio.
2. Accede a la carpeta backend y lanza el comandp `docker-compose up -d`. El cual lanzará una instancia de Mongo en localhost:27017.
3. Comprueba que las instancias están levantadas.
4. Instala las dependencias con `npm install`.
5. Ejecuta el entorno de desarrollo con `npm run dev`.
6. Accede a la carpeta de frontend y ejecuta el frontend con react `npm start`.

## Características en Desarrollo

- **Chat**: Implementación de la lógica del chat para simular un chat en timepo real.
- **Interfaz de Usuario**: Desarrollo de una interfaz de usuario intuitiva y atractiva para interactuar con la API.
- **Integración con Bases de Datos**: Configuración de una base de datos para almacenar conversaciones contenidas en un chat y sus usuarios.

## Documentación API

### Endpoints Disponibles

1. Crear Usuario

   ```URL: /users
   Método: POST
   Cuerpo de la Petición:
   name: Nombre del usuario (tipo string).
   Respuesta Esperada:
   Código de estado 200 OK con un JSON que contiene la información del usuario creado.

   ```

2. Crear Chat Room

   ```URL: /chatrooms
   Método: POST
   Cuerpo de la Petición:
   name: Nombre de la sala de chat (tipo string).
   Respuesta Esperada:
   Código de estado 200 OK con un JSON que contiene la información de la sala de chat creada.

   ```

3. Enviar Mensaje

    ```URL: /messages
    Método: POST
    Cuerpo de la Petición:
    chatRoomId: ID de la sala de chat (tipo string).
    sendrId: ID del remitente (tipo string).
    text: Mensaje de texto (tipo string).
    Respuesta Esperada:
    Código de estado 200 OK con un JSON que contiene el mensaje enviado.
    ```

4. Listar mensajes de una sala de chat

    ```URL: /chatrooms
    Método: GET
    Respuesta Esperada:
    Código de estado 200 OK con un JSON que contiene mensajes de la sala especificada.
    ```

## Tecnologías Utilizadas

Este proyecto utiliza una variedad de tecnologías modernas para su desarrollo, incluyendo:

- **Node.js**: Como entorno de ejecución para JavaScript en el servidor.
- **TypeScript**: Para añadir tipado estático al código y mejorar la calidad del desarrollo.
- **Socket.io**: Para poder escuchar los eventos y mantener el chat a tiempo real.
- **Prettier**: Para mantener un estilo de código consistente.

## Licencia

Este proyecto está bajo la Licencia ISC - vea el archivo `LICENSE` para más detalles.

---

¡Mantente atento para más actualizaciones!
