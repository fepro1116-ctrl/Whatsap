const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Almacenamiento en memoria
const groups = new Map();
const users = new Map();

// Generar código adhesión de grupo
function generateGroupCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Crear nuevo grupo
function createGroup() {
  const groupId = uuidv4();
  const code = generateGroupCode();
  
  groups.set(groupId, {
    id: groupId,
    code: code,
    name: `Grupo ${code}`,
    messages: [],
    members: []
  });
  
  return { groupId, code };
}

// Rutas HTTP
app.get('/api/groups/create', (req, res) => {
  const { groupId, code } = createGroup();
  res.json({ groupId, code });
});

app.post('/api/groups/join', (req, res) => {
  const { code } = req.body;
  
  for (const [groupId, group] of groups) {
    if (group.code === code) {
      return res.json({ 
        success: true, 
        groupId, 
        name: group.name,
        messages: group.messages 
      });
    }
  }
  
  res.status(404).json({ success: false, error: 'Código no encontrado' });
});

// Socket.io eventos
io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado:', socket.id);

  socket.on('join', (data) => {
    const { groupId, username } = data;
    const group = groups.get(groupId);
    
    if (!group) {
      socket.emit('error', 'Grupo no encontrado');
      return;
    }

    socket.join(groupId);
    users.set(socket.id, { groupId, username });
    
    if (!group.members.includes(username)) {
      group.members.push(username);
    }

    io.to(groupId).emit('user-joined', {
      username,
      members: group.members,
      message: `${username} se unió al chat`
    });
  });

  socket.on('send-message', (data) => {
    const user = users.get(socket.id);
    if (!user) return;

    const { groupId, message, image, isImage } = data;
    const group = groups.get(groupId);
    
    if (!group) return;

    const messageObj = {
      id: uuidv4(),
      username: user.username,
      timestamp: new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    // Añadir contenido: imagen o texto
    if (isImage && image) {
      messageObj.image = image;
    } else {
      messageObj.text = message;
    }

    group.messages.push(messageObj);
    io.to(groupId).emit('receive-message', messageObj);
  });

  socket.on('typing', (data) => {
    const user = users.get(socket.id);
    if (!user) return;
    
    socket.to(user.groupId).emit('user-typing', {
      username: user.username
    });
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      const group = groups.get(user.groupId);
      if (group) {
        group.members = group.members.filter(m => m !== user.username);
        io.to(user.groupId).emit('user-left', {
          username: user.username,
          members: group.members,
          message: `${user.username} salió del chat`
        });
      }
      users.delete(socket.id);
    }
    console.log('Usuario desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
