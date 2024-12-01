const AuthService = require('../services/authService');
const { StatusCodes } = require('http-status-codes');

const register = (req, res) => {
  const { name, email, password } = req.body;

    AuthService.registerInspector(name, email, password).then(inspector => {
      res.status(StatusCodes.CREATED).json({
        message: "Inspector registrado com sucesso!",
      inspector: { ...inspector, password: undefined }
      });
    }).catch(error => {
      res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  
  AuthService.loginInspector(email, password).then(result => {
    res.status(StatusCodes.OK).json(result);
  }).catch(error => {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  });
};

module.exports = { register, login }; 