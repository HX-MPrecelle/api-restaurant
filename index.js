const { search } = require('./src/controller/controller');
const server = require("./src/app.js");
const { conn } = require("./src/db.js");

const PORT = process.env.PORT || 8080;

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  server.listen(PORT, async () => {
    await search();
    console.log(`%s listening at ${PORT}`);
  });
});
