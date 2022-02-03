const { Router } = require('express');
const restaurantRoute = require('./restaurantRoute');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const router = Router();

// Configurar los routers
// // Ejemplo: router.use('/auth', authRouter);
router.use('/restaurant', restaurantRoute)

module.exports = router;