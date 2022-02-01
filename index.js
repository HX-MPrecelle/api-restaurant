const server = require('./src/app.js');
const { conn } = require('./src/db.js');

// Syncing all the models at once.
conn.sync({ force: true })
.then(() => {
  server.listen(3001, () => {
    console.log('%s listening at 3001'); 
  });
});


// Syncing all the models at once.
// conn.sync({ force: true }).then(() => {
//   server.listen(3001, async () => {
//     let apiURL = await axios.get(`https://restcountries.com/v3.1/all`);
//     apiURL = apiURL.data;

//     let apiInfo = apiURL.forEach(async (country) => {
//       Country.create({
//         id: country.cca3,
//         name: country.name.common,
//         flags: country.flags.png,
//         continent: country.region,
//         capital: country.capital ? country.capital : [],
//         area: country.area ,
//         subregion: country.subregion,
//         population: country.population,
//       });
//     });

//     console.log("%s listening at 3001"); // eslint-disable-line no-console
//     return apiInfo;
//   });
// });