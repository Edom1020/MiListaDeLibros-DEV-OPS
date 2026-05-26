import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const authorization = req.header('Authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ mensaje: 'Acceso denegado' });
    }

    const token = authorization.slice(7).trim();
    if (!token) {
      return res.status(401).json({ mensaje: 'Acceso denegado' });
    }

    const verificado = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });
    req.usuario = verificado;
    next();

  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido' });
  }
};

export default auth;
