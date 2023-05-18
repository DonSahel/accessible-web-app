export const client = axios.create({
    baseURL: "https://api.football-data.org/v4/", 
    headers: {
        common: {        // can be common or any other method
            'X-Auth-Token': 'f324046c46de4dceaf44fd36040854bf'
        }
      }
});
  