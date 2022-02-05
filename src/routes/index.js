const { Router } = require('express');
const restaurantRoute = require('./restaurantRoute');
const neighborhoodRoute = require('./neighborhoodRoute');
const userRoute = require('./userRoute');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const router = Router();

// Configurar los routers
// // Ejemplo: router.use('/auth', authRouter);
router.use('/restaurant', restaurantRoute)
router.use('/user', userRoute)
router.use('/neighborhood', neighborhoodRoute)

module.exports = router;