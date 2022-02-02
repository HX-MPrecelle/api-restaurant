var axios = require("axios").default;

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
            neighborhood: e.neighborhood_info?.map(e => e.name)
        }
    })
    
    console.log(restaurantsBa);
    return restaurantsBa;
}

search();

module.exports = {
    typehead
}