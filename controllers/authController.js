const AuthService = require('../services/authService');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const inspector = await AuthService.registerInspector(name, email, password);
    res.status(StatusCodes.CREATED).json({
      message: "Inspector registrado com sucesso!",
      inspector: { ...inspector, password: undefined }
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await AuthService.loginInspector(email, password);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  }
};

module.exports = { register, login }; 