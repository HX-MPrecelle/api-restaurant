//hola
const axios = require("axios").default;
const { Reserve, Restaurant, Review, User, Type } = require("../db");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { API_KEY } = process.env;

// voy a traer la informacion de mi Api que por logica viene de forma asicronica
const getApiInfo = async () => {
  const ApiUrl = await axios.get(
    `https://rapidapi.com/ptwebsolution/api/worldwide-restaurants?apiKey=${API_KEY}&addRecipeInformation=true&number=100`
  );

  const apiInfo = ApiUrl.data.results.map((obj) => {
    return {
      id: obj.location_id,
      name: obj.name,
      photo: obj.photo.images.original.url,
      rating: obj.rating,
      price: obj.price,
      description: obj.description,
      category: obj.category,
      subcategory: obj.subcategory,
      reviews: obj.reviews.map((e) => {
        e.title, e.rating, e.published_date, e.summary, e.author, e.url;
      }),
      email: obj.email,
      address: obj.address,
      cuisine: obj.cuisine.map((e) => e.name),
      menu: obj.menu_web_url,
    };
  });
  return apiInfo;
};

// voy a traer la informacion de mi base de datos que tambie viene de forma asincronica
const getDBInfo = async () => {
  return await Restaurant.findAll({
    include: {
      model: Reserve,
      Review,
      User,
      Type,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
  });
};

// vamos a unir la informacion de la api con la informacion de nuestra base de datos
const getAllRecipes = async () => {
  const apiInfo = await getApiInfo();
  const DBInfo = await getDBInfo();
  return apiInfo.concat(DBInfo);
};
