# WhatsAp - Chat Grupal Instantáneo 💬

Una aplicación web moderna de chat grupal en tiempo real con un diseño minimalista con tema oscuro, emojis, stickers e imágenes.

## 🎨 Características Principales

### ✨ Mensajería en Tiempo Real
- Envío instantáneo de mensajes entre usuarios
- Indicador de escritura en vivo
- Timestamps automáticos en cada mensaje

### 😊 Emojis Integrados (48+)
- Selector de emojis con una variedad completa
- Inserción rápida haciendo clic o escribiendo
- Cierre automático al comenzar a escribir

### 🎨 Stickers (40+)
- Variedad de stickers: celebraciones, amor, reacciones, etc.
- Envío directo de stickers con un clic
- Interfaz intuitiva y colorida

### 📸 Compartir Imágenes
- Sube y comparte imágenes en tiempo real
- Soporte para todos los formatos de imagen comunes
- Visualización inmediata en el chat

### 👥 Gestión de Grupos
- **Crear grupos**: Genera un código único de 6 caracteres automáticamente
- **Unirse a grupos**: Usa el código para acceder a grupos existentes
- **Lista de miembros**: Ve quién está conectado en tiempo real
- **Notificaciones**: Alertas cuando alguien se une o sale

### 🎯 Utilidades
- **Copiar código**: Copia el código del grupo al portapapeles con un clic
- **Salir del grupo**: Opción de desconectarse cuando lo desees

### 🎨 Interfaz Moderna
- Diseño minimalista con tema oscuro (fondo #0a0a0a)
- Colores gradiente cyan (#00d4ff) y rosa (#ff0080)
- Interfaz responsiva para móvil y escritorio
- Efectos visuales suaves y animaciones

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **Socket.io** - Comunicación bidireccional en tiempo real
- **UUID** - Generación de identificadores únicos
- **CORS** - Habilitación de solicitudes cruzadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos avanzados con gradientes y efectos
- **JavaScript Vanilla** - Lógica del cliente sin dependencias
- **Socket.io Cliente** - Para conexión en tiempo real

## 📦 Requisitos Previos

- Node.js versión 14 o superior
- npm o yarn
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/Whatsap.git
cd Whatsap
```

### 2. Instalar dependencias del servidor

```bash
cd server
npm install
```

### 3. Iniciar el servidor

```bash
npm start
```

El servidor se ejecutará en: **http://localhost:3000**

### 4. Acceder a la aplicación

Abre tu navegador en:
```
http://localhost:3000
```

## 🎮 Guía de Uso

### Crear un Nuevo Grupo

1. Abre la aplicación
2. Haz clic en **"➕ Crear Grupo"**
3. Ingresa tu nombre de usuario (máx. 20 caracteres)
4. Haz clic en **"Crear Grupo"**
5. Se generará automáticamente un código único (6 caracteres)
6. Comparte este código con tus amigos

### Unirse a un Grupo Existente

1. Abre la aplicación
2. Haz clic en **"🔗 Unirse a Grupo"**
3. Ingresa tu nombre de usuario
4. Ingresa el código del grupo (proporcionado por el creador)
5. Haz clic en **"Unirse"**
6. ¡Listo! Ya estás en el group

### Enviar Mensajes

#### Mensaje de Texto
1. Escribe tu mensaje en el campo de texto
2. Presiona **Enter** o haz clic en el botón **"➤"**

#### Insertar Emojis
1. Haz clic en el botón **😊** (emoji)
2. Selecciona un emoji del grid
3. Se insertará en tu mensaje actual
4. Completa tu mensaje y envía

#### Usar Stickers
1. Haz clic en el botón **🎨** (sticker)
2. Selecciona un sticker del grid
3. Se enviará **automáticamente** como mensaje

#### Compartir Imágenes
1. Haz clic en el botón **📸** (cámara)
2. Selecciona una imagen de tu dispositivo
3. Se compartirá **automáticamente**
4. Los miembros verán la imagen en tiempo real

### Utilidades

#### Copiar Código del Grupo
- Haz clic en el botón **📋** en la esquina superior derecha
- El código se copiará automáticamente al portapapeles
- Recibirás una confirmación visual (✓)

#### Salir del Grupo
- Haz clic en el botón **🚪** en la esquina superior derecha
- Confirma que deseas salir
- Se enviará una notificación a los demás miembros

## 📁 Estructura del Proyecto

```
Whatsap/
├── client/                 # Frontend de la aplicación
│   ├── index.html         # Interfaz HTML
│   ├── styles.css         # Estilos CSS
│   └── client.js          # Lógica del cliente
│
├── server/                 # Backend de la aplicación
│   ├── server.js          # Servidor Express y Socket.io
│   ├── package.json       # Dependencias
│   └── package-lock.json  # Lock file
│
└── README.md              # Este archivo
```

## ⚙️ Configuración

### Cambiar el Puerto

Para ejecutar el servidor en un puerto diferente, establece la variable de entorno `PORT`:

```bash
PORT=5000 npm start
```

O modifica directamente la última línea de `server/server.js`:

```javascript
const PORT = process.env.PORT || 3000; // Cambia 3000 por tu puerto deseado
```

### Instalación de Dependencias

Si necesitas reinstalar las dependencias del servidor:

```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

## 🌐 Despliegue

### Desplegar en Heroku

```bash
heroku login
heroku create nombre-de-tu-app
git push heroku main
```

### Desplegar en un Servidor Privado

1. Sube los archivos a tu servidor
2. Instala Node.js
3. Ejecuta:
```bash
npm install
npm start
```

### Desplegar con Docker

Crea un archivo `Dockerfile`:

```dockerfile
FROM node:16
WORKDIR /app
COPY . .
WORKDIR /app/server
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

Luego ejecuta:
```bash
docker build -t whatsap .
docker run -p 3000:3000 whatsap
```

## 🔐 Notas Importantes

### Almacenamiento de Datos
- Los mensajes se almacenan en memoria (RAM)
- Los datos se pierden al reiniciar el servidor
- Los códigos de grupo son únicos pero aleatorios

### Imágenes
- Se envían como Base64
- Límite recomendado: 5MB por imagen
- Se almacenan en memoria durante la sesión

### Seguridad
- La aplicación está diseñada para uso local/privado
- No incluye autenticación de usuarios
- Cualquiera puede acceder con el código del grupo

## 🚧 Mejoras Futuras

- [ ] Persistencia de datos en base de datos
- [ ] Historial de mensajes archivado
- [ ] Búsqueda de mensajes
- [ ] Editar y eliminar mensajes
- [ ] Llamadas de voz y video
- [ ] Reacciones de emoji en mensajes
- [ ] Modo claro/oscuro
- [ ] Autenticación JWT
- [ ] Mensajes privados 1-a-1
- [ ] Notificaciones del navegador
- [ ] Encriptación de mensajes
- [ ] Subida de archivos

## 🐛 Solución de Problemas

### El servidor no inicia

```bash
# Verifica que Node.js esté instalado
node --version

# Reinstala dependencias
cd server
npm install

# Intenta iniciar de nuevo
npm start
```

### No puedo ver los emojis/stickers

- Verifica que tu navegador sea moderno (2020+)
- Actualiza tu navegador
- Limpia la caché del navegador

### Las imágenes no se cargan

- Verifica el tamaño de la imagen (máx. 5MB recomendado)
- Usa formatos comunes (JPG, PNG, GIF, WebP)
- Verifica la conexión a internet

### Problemas de conexión

- Verifica que el servidor esté ejecutándose
- Recarga la página del navegador
- Verifica tu cortafuegos

## 📊 Estadísticas Técnicas

- **Emojis disponibles**: 48
- **Stickers disponibles**: 40
- **Código de grupo**: 6 caracteres
- **Username máximo**: 20 caracteres
- **Conexiones simultáneas**: Ilimitadas

## 📝 Archivo de Cambios

### Versión 2.0 (Actual)
- ✅ Selector de emojis (48+)
- ✅ Selector de stickers (40+)
- ✅ Compartición de imágenes
- ✅ Interfaz mejorada con colores gradiente
- ✅ Efectos visuales y animaciones

### Versión 1.0
- ✅ Chat en tiempo real
- ✅ Crear y unirse a grupos
- ✅ Lista de miembros
- ✅ Indicador de escritura

## 📞 Soporte y Contacto

Para reportar bugs, sugerencias o preguntas:

1. Abre un **Issue** en GitHub
2. Describe el problema detalladamente
3. Incluye capturas de pantalla si es posible
4. Especifica tu navegador y sistema operativo

## 📄 Licencia

Este proyecto está bajo licencia **MIT**. Consulta el archivo LICENSE para más detalles.

## 👨‍💻 Autores y Contribuidores

Creado con ❤️ para proporcionar una forma simple y moderna de chatear en tiempo real.

## 🙏 Agradecimientos

- Socket.io por la comunicación en tiempo real
- Express.js por el framework web
- Node.js por el runtime

---

**¿Te gusta el proyecto?** ⭐ Dale una estrella en GitHub

**¿Tienes sugerencias?** 💬 Abre un issue

**¡Disfruta chatear!** 🎉
