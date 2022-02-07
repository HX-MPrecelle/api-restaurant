const { Router } = require('express');
const restaurantRoute = require('./restaurantRoute');
const neighborhoodRoute = require('./neighborhoodRoute');
const userRoute = require('./userRoute');
const cuisinesRoute = require('./cuisinesRoute');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const router = Router();

// Configurar los routers
// // Ejemplo: router.use('/auth', authRouter);
router.use('/restaurant', restaurantRoute)
router.use('/user', userRoute)
router.use('/neighborhood', neighborhoodRoute)
router.use('/cuisines', cuisinesRoute)

module.exports = router;