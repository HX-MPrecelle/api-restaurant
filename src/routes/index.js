const { Router } = require('express');
const restaurantRoute = require('./restaurantRoute');
const neighborhoodRoute = require('./neighborhoodRoute');
const userRoute = require('./userRoute');
const cuisinesRoute = require('./cuisinesRoute');
const loginRoute = require('./loginRoute');
const reviewsRoute = require('./reviewsRoute');
const reservesRoute = require('./reservesRoute');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const router = Router();

// Configurar los routers
// // Ejemplo: router.use('/auth', authRouter);
router.use('/restaurant', restaurantRoute)
router.use('/user', userRoute)
router.use('/neighborhood', neighborhoodRoute)
router.use('/cuisines', cuisinesRoute)
router.use('/login', loginRoute)
router.use('/review', reviewsRoute)
router.use('/reserve', reservesRoute)

module.exports = router;
