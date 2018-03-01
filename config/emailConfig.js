const email = require("emailjs");
const emailServer = email.server.connect({
    user: "contato@riw.com.br",
    password: "Senha123.",
    host: "smtp.gmail.com",
    ssl: true
});

module.exports = emailServer;