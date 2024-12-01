const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
const Inspector = require('../models/inspector');

class AuthService {
  static async registerInspector(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const inspector = new Inspector(name, email, hashedPassword);
    
    return prisma.inspector.create({
      data: {
        name: inspector.name,
        email: inspector.email,
        password: inspector.password,
      }
    });
  }

  static async loginInspector(email, password) {
    const inspectorData = await prisma.inspector.findUnique({
      where: { email }
    });

    // Nao quero dar contexto do erro para nao facilitar a quebrar a seguranca
    if (!inspectorData) {
      throw new Error('Não autorizado');
    }

    const inspector = new Inspector(
      inspectorData.name,
      inspectorData.email,
      inspectorData.password
    );

    const validPassword = await bcrypt.compare(password, inspector.password);
    // Nao quero dar contexto do erro para nao facilitar a quebrar a seguranca
    if (!validPassword) {
      throw new Error('Não autorizado');
    }

    const token = jwt.sign(
      { id: inspectorData.id, email: inspector.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, inspector: { ...inspectorData, password: undefined } };
  }
}

module.exports = AuthService; 