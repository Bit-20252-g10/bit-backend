# BIT BACKEND

API para la gestión de videojuegos usando Node.js, Express y MongoDB Atlas.

## Características

- CRUD de videojuegos (create, read, update, delete)
- Conexión a base de datos MongoDB Atlas
- Rutas RESTful para `/games`
- Middleware de logging con morgan
- Configuración por variables de entorno

## Endpoints principales

- `GET    /games`         → Lista todos los juegos
- `POST   /games`         → Crea un nuevo juego
- `GET    /games/:id`     → Obtiene un juego por ID
- `PUT    /games/:id`     → Actualiza un juego por ID
- `DELETE /games/:id`     → Elimina un juego por ID

## Ejemplo de body para CRUD

```json 
{
  "name": "Super Mario Bros",
  "genre": "Plataformas",
  "age": 7,
  "console": "Nintendo Switch",
  "enrolled": true
}
```

## Herramientas recomendadas

- [Postman](https://www.postman.com/) para probar los endpoints
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) para la base de datos

## Autor

- GitHub[https://github.com/Nojhze4]
- Linkedin[www.linkedin.com/in/jhon-ramirez-desarroladorfullstack]

---# bit-backend
# bit-frontend
# bit-backend
