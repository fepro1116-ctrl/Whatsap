let socket;
let currentUser = {
    username: '',
    groupId: '',
    code: ''
};

const screens = {
    start: document.getElementById('start-screen'),
    create: document.getElementById('create-screen'),
    join: document.getElementById('join-screen'),
    loading: document.getElementById('loading-screen'),
    chat: document.getElementById('chat-screen')
};

const elements = {
    messagesContainer: document.getElementById('messages'),
    messageInput: document.getElementById('message-input'),
    membersList: document.getElementById('members-list'),
    groupName: document.getElementById('group-name'),
    membersCount: document.getElementById('members-count'),
    typingIndicator: document.getElementById('typing-indicator'),
    typingUsername: document.getElementById('typing-username'),
    copyCodeBtn: document.getElementById('copy-code-btn'),
    emojiPicker: document.getElementById('emoji-picker'),
    stickerPicker: document.getElementById('sticker-picker'),
    emojiGrid: document.getElementById('emoji-grid'),
    stickerGrid: document.getElementById('sticker-grid')
};

// Emojis disponibles
const EMOJIS = [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
    '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
    '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜',
    '🤪', '😝', '😑', '😐', '😶', '😏', '😒', '🙁',
    '😞', '😔', '😟', '😕', '🙁', '☹️', '😲', '😳',
    '😦', '😧', '😬', '🤐', '😷', '🤒', '🤕', '🤢'
];

// Stickers disponibles
const STICKERS = [
    '🎉', '🎊', '🎈', '🎁', '🎀', '🎯', '🎪', '🎭',
    '🎨', '🎬', '🎤', '🎧', '🎮', '🎲', '🎰', '🏆',
    '⭐', '✨', '💫', '🌟', '🌠', '💥', '💢', '💯',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
    '👍', '👏', '🙌', '👊', '✊', '🤝', '🙏', '💪'
];

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');

    // Trigger cinematic light sweep when showing start screen
    if (screenName === 'start') {
        triggerLightSweep();
    }
}

function showCreateScreen() {
    document.getElementById('create-username').value = '';
    showScreen('create');
}

function showJoinScreen() {
    document.getElementById('join-username').value = '';
    document.getElementById('join-code').value = '';
    showScreen('join');
}

function backToStart() {
    showScreen('start');
}

async function createGroup() {
    const username = document.getElementById('create-username').value.trim();
    
    if (!username) {
        alert('Por favor ingresa tu nombre');
        return;
    }

    showScreen('loading');

    try {
        const response = await fetch('/api/groups/create');
        const data = await response.json();

        currentUser.username = username;
        currentUser.groupId = data.groupId;
        currentUser.code = data.code;

        connectSocket();
        initializeChat();
        
        setTimeout(() => {
            showScreen('chat');
            elements.groupName.textContent = `Grupo: ${data.code}`;
            elements.copyCodeBtn.onclick = () => copyToClipboard(data.code);
        }, 500);
    } catch (error) {
        console.error('Error creando grupo:', error);
        alert('Error al crear el grupo');
        showScreen('start');
    }
}

async function joinGroup() {
    const username = document.getElementById('join-username').value.trim();
    const code = document.getElementById('join-code').value.trim().toUpperCase();

    if (!username || !code) {
        alert('Por favor completa todos los campos');
        return;
    }

    showScreen('loading');

    try {
        const response = await fetch('/api/groups/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });

        const data = await response.json();

        if (!data.success) {
            alert('Código no encontrado');
            showScreen('join');
            return;
        }

        currentUser.username = username;
        currentUser.groupId = data.groupId;
        currentUser.code = code;

        connectSocket();
        initializeChat();

        setTimeout(() => {
            showScreen('chat');
            elements.groupName.textContent = `Grupo: ${code}`;
            elements.copyCodeBtn.onclick = () => copyToClipboard(code);
            
            data.messages.forEach(msg => displayMessage(msg));
        }, 500);
    } catch (error) {
        console.error('Error uniéndose al grupo:', error);
        alert('Error al unirse al grupo');
        showScreen('join');
    }
}

function connectSocket() {
    socket = io();

    socket.on('connect', () => {
        console.log('Conectado');
        socket.emit('join', {
            groupId: currentUser.groupId,
            username: currentUser.username
        });
    });

    socket.on('user-joined', (data) => {
        updateMembers(data.members);
        showSystemMessage(data.message);
    });

    socket.on('receive-message', (msg) => {
        displayMessage(msg);
    });

    socket.on('user-left', (data) => {
        updateMembers(data.members);
        showSystemMessage(data.message);
    });

    socket.on('user-typing', (data) => {
        showTypingIndicator(data.username);
    });

    socket.on('error', (error) => {
        console.error('Error:', error);
        alert(error);
    });
}

// Inicializar interfaz de chat
function initializeChat() {
    // Inicializar emoji picker
    elements.emojiGrid.innerHTML = EMOJIS.map(emoji => 
        `<div class="emoji-item" onclick="insertEmoji('${emoji}')">${emoji}</div>`
    ).join('');

    // Inicializar sticker picker
    elements.stickerGrid.innerHTML = STICKERS.map(sticker => 
        `<div class="sticker-item" onclick="insertSticker('${sticker}')">${sticker}</div>`
    ).join('');
}

// Toggle emoji picker
function toggleEmojiPicker() {
    elements.emojiPicker.classList.toggle('active');
    elements.stickerPicker.classList.remove('active');
}

// Toggle sticker picker
function toggleStickerPicker() {
    elements.stickerPicker.classList.toggle('active');
    elements.emojiPicker.classList.remove('active');
}

// Insertar emoji
function insertEmoji(emoji) {
    elements.messageInput.value += emoji;
    elements.messageInput.focus();
    elements.emojiPicker.classList.remove('active');
}

// Insertar sticker
function insertSticker(sticker) {
    elements.messageInput.value = sticker;
    elements.messageInput.focus();
    elements.stickerPicker.classList.remove('active');
    sendMessage();
}

// Enviar imagen
function sendImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const imageData = e.target.result;
        socket.emit('send-message', {
            groupId: currentUser.groupId,
            message: 'image',
            image: imageData,
            isImage: true
        });
    };
    reader.readAsDataURL(file);

    // Limpiar input
    document.getElementById('image-input').value = '';
}

function displayMessage(msg) {
    const messageDiv = document.createElement('div');
    const isOwn = msg.username === currentUser.username;
    
    messageDiv.classList.add('message', isOwn ? 'own' : 'other');
    
    let messageContent = `
        <div class="message-content">
            ${!isOwn ? `<div class="message-header"><strong>${msg.username}</strong></div>` : ''}
    `;
    
    if (msg.image) {
        messageContent += `<img src="${msg.image}" class="message-image" alt="Imagen" onclick="window.open(this.src)">`;
    } else if (msg.text) {
        messageContent += `<div class="message-text">${escapeHtml(msg.text)}</div>`;
    }
    
    messageContent += `
            <div class="message-time">${msg.timestamp}</div>
        </div>
    `;
    
    messageDiv.innerHTML = messageContent;
    elements.messagesContainer.appendChild(messageDiv);
    elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
}

function showSystemMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('system-message');
    msgDiv.textContent = text;
    elements.messagesContainer.appendChild(msgDiv);
    elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
}

function updateMembers(members) {
    elements.membersCount.textContent = `${members.length} miembro${members.length !== 1 ? 's' : ''}`;
    elements.membersList.innerHTML = members.map(member => `<li>${member}</li>`).join('');
}

let typingTimeout;
function showTypingIndicator(username) {
    elements.typingUsername.textContent = username;
    elements.typingIndicator.classList.add('active');

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        elements.typingIndicator.classList.remove('active');
    }, 2000);
}

// Manejar escritura activa
let isTyping = false;
function handleTyping() {
    if (!isTyping && elements.messageInput.value.length > 0) {
        isTyping = true;
        socket.emit('typing', { groupId: currentUser.groupId });
    }

    if (elements.messageInput.value.length === 0) {
        isTyping = false;
    }
    
    // Cerrar pickers al escribir
    elements.emojiPicker.classList.remove('active');
    elements.stickerPicker.classList.remove('active');
}

function sendMessage() {
    const message = elements.messageInput.value.trim();

    if (!message) return;

    socket.emit('send-message', {
        groupId: currentUser.groupId,
        message: message
    });

    elements.messageInput.value = '';
    isTyping = false;
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        elements.copyCodeBtn.textContent = '✓';
        setTimeout(() => {
            elements.copyCodeBtn.textContent = '📋';
        }, 2000);
    });
}

function leaveGroup() {
    if (confirm('¿Salir del grupo?')) {
        socket.disconnect();
        showScreen('start');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Cerrar pickers al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('.tool-btn') && !e.target.closest('.emoji-picker') && !e.target.closest('.sticker-picker')) {
        elements.emojiPicker.classList.remove('active');
        elements.stickerPicker.classList.remove('active');
    }
});

// Inicializar
showScreen('start');

// Cinematic light-sweep: trigger a quick shine across the hero title
function triggerLightSweep() {
    const sweep = document.querySelector('.light-sweep');
    if (!sweep) return;
    sweep.classList.remove('sweep');
    // force reflow to restart animation
    void sweep.offsetWidth;
    sweep.classList.add('sweep');
}

// Periodically sweep while on start screen
setInterval(() => {
    if (screens.start.classList.contains('active')) {
        triggerLightSweep();
    }
}, 7000);

// --- Particle system (subtle sparks / lens particles) ---
const canvas = document.getElementById('particle-canvas');
let ctx, particles = [], cw, ch;

function initParticles() {
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    particles = [];
    for (let i = 0; i < 28; i++) {
        particles.push(createParticle());
    }
    requestAnimationFrame(updateParticles);
}

function resizeCanvas() {
    if (!canvas) return;
    cw = canvas.width = window.innerWidth;
    ch = canvas.height = window.innerHeight;
}

function createParticle() {
    return {
        x: Math.random() * cw,
        y: Math.random() * ch * 0.6,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.25,
        size: 1 + Math.random() * 3,
        life: 40 + Math.random() * 120,
        alpha: 0.03 + Math.random() * 0.12
    };
}

function updateParticles() {
    if (!ctx) return;
    ctx.clearRect(0,0,cw,ch);
    for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        p.alpha *= 0.999;

        // draw
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size*8);
        g.addColorStop(0, `rgba(255,240,200,${p.alpha})`);
        g.addColorStop(1, `rgba(255,160,60,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size*2, 0, Math.PI*2);
        ctx.fill();

        if (p.life <= 0 || p.y < -50 || p.alpha < 0.003) {
            Object.assign(p, createParticle());
            p.y = ch * 0.9 - Math.random() * ch * 0.6;
        }
    }
    requestAnimationFrame(updateParticles);
}

window.addEventListener('resize', () => {
    resizeCanvas();
});

// Start particles on load
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
});
