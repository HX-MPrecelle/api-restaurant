var axios = require("axios").default;
const { Restaurant, Type } = require('../db');

const typehead = async () => {
    var options = {
        method: 'POST',
        url: 'https://worldwide-restaurants.p.rapidapi.com/typeahead',
        headers: {
          'x-rapidapi-host': 'worldwide-restaurants.p.rapidapi.com',
          'x-rapidapi-key': 'daa46121d4msh1586432661d0f79p1e922bjsnd538bbbb9285'
        },
        data: {language: 'es_AR', q: 'buenos aires'}
      };

    var infoApi = await axios.request(options);
    var ba = infoApi.data.results.data[0].result_object.location_id;
    return ba;
}

const search = async () => {

    var id = await typehead();

    var options = {
        method: 'POST',
        url: 'https://worldwide-restaurants.p.rapidapi.com/search',
        headers: {
          'x-rapidapi-host': 'worldwide-restaurants.p.rapidapi.com',
          'x-rapidapi-key': 'daa46121d4msh1586432661d0f79p1e922bjsnd538bbbb9285'
        },
        data: {currency: 'ARS', location_id: id, limit: '100', language: 'es_AR'}
      };
    
    var infoApi = await axios.request(options);
    var restaurantsBa = await infoApi.data.results.data?.map(e => {
        return {
            id: e.location_id,
            name: e.name,
            photo: e.photo.images.original.url,
            email: e.email,
            rating: e.rating,
            cuisine: e.cuisine?.map(e => e.name),
            neighborhood: e.neighborhood_info?.map(e => e.name),
            price: e.price_level //primer valor del string
        }
    })
    
    // console.log(restaurantsBa);
    return restaurantsBa;
}

const getCuisines = async () => {
  var id = await typehead();

    var options = {
        method: 'POST',
        url: 'https://worldwide-restaurants.p.rapidapi.com/search',
        headers: {
          'x-rapidapi-host': 'worldwide-restaurants.p.rapidapi.com',
          'x-rapidapi-key': 'daa46121d4msh1586432661d0f79p1e922bjsnd538bbbb9285'
        },
        data: {currency: 'ARS', location_id: id, limit: '100', language: 'es_AR'}
      };
    
    var infoApi = await axios.request(options);
    var data = infoApi.data.results.data?.map(e => e.cuisine?.map(c => c.name))
    var types = [];
    for (const array of data) {
      array.forEach(t => types.push(t))
    }
    var typesCuisine = [...new Set(types)]
    // console.log(typesCuisine);
    return typesCuisine;
}


const pushCuisinesDb = async () => {
  let typesCuisine = await getCuisines();

  typesCuisine.forEach(type => {
    Type.findOrCreate({
      where: {
        name: type,
      }
    })
  });
  var allTypes = await Type.findAll();
  // console.log(allTypes);
  return allTypes;
}

const getRestaurantsDb = async () => {
  let restaurants = await Restaurant.findAll({
    include: {
      model: Type,
      attributes: ['name'],
      through: {
        attributes: []
      }
    }
  });
  // console.log(restaurants);
  return restaurants;
}

const getAllRestaurants = async () => {
  let api = await search();
  let db = await getRestaurantsDb();
  let allRestaurants = api.concat(db);
  // console.log(allRestaurants);
  return allRestaurants;
}

// pushCuisinesDb()

const getNeighborhood = async () => {

  var id = await typehead();
    var options = {
        method: 'POST',
        url: 'https://worldwide-restaurants.p.rapidapi.com/search',
        headers: {
          'x-rapidapi-host': 'worldwide-restaurants.p.rapidapi.com',
          'x-rapidapi-key': 'daa46121d4msh1586432661d0f79p1e922bjsnd538bbbb9285'
        },
        data: {currency: 'ARS', location_id: id, limit: '100', language: 'es_AR'}
      };
    var infoApi = await axios.request(options);
    var data = infoApi.data.results.data?.map(e => e.neighborhood_info?.map(n => n.name))
    var neighborhoods = [];
    for (const array of data) {
      array.forEach(n => neighborhoods.push(n))
    }
    var neighborhood = [...new Set(neighborhoods)]
    // console.log(neighborhood);
    return neighborhood;
}


module.exports = {
    typehead,
    search,
    getCuisines,
    pushCuisinesDb,
    getRestaurantsDb,
    getAllRestaurants,
    getNeighborhood
}