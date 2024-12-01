const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const authenticateInspector = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ 
      error: "Token de autenticação não fornecido" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.inspector = decoded;
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ 
      error: "Token inválido" 
    });
  }
};

module.exports = { authenticateInspector }; 