import { AppDataSource } from "./config"

AppDataSource.initialize().then(async () => {
    require('./server');
}).catch(error => console.log(error))
