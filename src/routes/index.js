const { Router } = require('express');
const restaurantsRoute = require('./restaurantsRoute');
const neighborhoodsRoute = require('./neighborhoodsRoute');
const usersRoute = require('./usersRoute');
const cuisinesRoute = require('./cuisinesRoute');
const loginRoute = require('./loginRoute');
const reservesRoute = require('./reservesRoute');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const router = Router();

// Configurar los routers
// // Ejemplo: router.use('/auth', authRouter);
router.use('/restaurants', restaurantsRoute)
router.use('/users', usersRoute)
router.use('/neighborhoods', neighborhoodsRoute)
router.use('/cuisines', cuisinesRoute)
router.use('/logins', loginRoute)
router.use('/reserves', reservesRoute)

module.exports = router;
