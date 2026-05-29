const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    try {
      const usuario = req.usuario;

      if (!usuario) {
        return res.status(401).json({ msg: "No autenticado" });
      }

      if (!usuario.rol) {
        return res.status(403).json({ msg: "Usuario sin rol asignado" });
      }

      if (!rolesPermitidos.includes(usuario.rol)) {
        return res.status(403).json({
          msg: "No tienes permisos para esta acción",
          rolUsuario: usuario.rol,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ msg: "Error en verificación de rol", error });
    }
  };
};

export default verificarRol;