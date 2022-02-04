const axios = require("axios").default;
const  {Reserve, Restaurant, Review, User, Type }  = require('../db.js');
const Sequelize = require("sequelize");

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
    
    // console.log(restaurantsBa);
    return restaurantsBa;
}

const  getDB = async() =>{
 const restaurantDB =  await Restaurant.findAll({
      include :{
        models:   Reserve, Review, User, Type,
        attributes :["name"],
        through: { attributes: [],
      }
      }
    }) 
    console.log(restaurantDB)
    return restaurantDB
  }

  
const pushCuisinesDb = async () => {
  var typesCuisine = await getCuisines();

  typesCuisine.forEach((type) => {
    Type.findOrCreate({
      where: {
        name: type,
      },
    });
  });
  var allTypes = await Type.findAll();
  console.log(allTypes);
  return allTypes;
};

const getCuisines = async () => {
  var id = await typehead();

  var options = {
    method: "POST",
    url: "https://worldwide-restaurants.p.rapidapi.com/search",
    headers: {
      "x-rapidapi-host": "worldwide-restaurants.p.rapidapi.com",
      "x-rapidapi-key": "daa46121d4msh1586432661d0f79p1e922bjsnd538bbbb9285",
    },
    data: { currency: "ARS", location_id: id, limit: "100", language: "es_AR" },
  };

  var infoApi = await axios.request(options);
  var data = infoApi.data.results.data?.map((e) =>
    e.cuisine?.map((c) => c.name)
  );
  var types = [];
  for (const array of data) {
    array.forEach((t) => types.push(t));
  }
  var typesCuisine = [...new Set(types)];
  console.log(typesCuisine);
  return typesCuisine;
};





const AllInfo = async() =>{
  const apiUrl = await search()
  const db = await getDB() 
  return apiUrl.concat(db)
}




 async function  restaurantName (req, res) {
  const name = req.query.name.trim(); //name from query(url)
  
  const totalInfo = await AllInfo()
  
    if(name){
      let resultName = await totalInfo.filter(el=>  el.name.toLowerCase().includes(name.toLowerCase()) )
      resultName.length > 0? res.status(200).json(resultName) : res.status(404).json({message: "El restaurant ,no existe" })
    }else{
      res.status(200).json(totalInfo)
    }
   

} 




const restaurantByID = async(req, res) => {
  const {id} = req.params.id.trim();
  const totalInfo = AllInfo();

  if(id){
    let resultID = await totalInfo.filter(el => el.id.toString() === id.toString())
    resultID.length > 0? res.status(200).send(resultID) : res.status(404).send({message: "No existe el id del restaurant"})
  }

}



// search();
// getDB()
// pushCuisinesDb()
// AllInfo()
module.exports = {
    typehead,
    search,
    getCuisines,
    pushCuisinesDb
}
