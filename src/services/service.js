import { cartsManager, productsManager, usersManager } from "../data/managers/mongo/manager.mongo.js";

class Service {
    constructor(manager) {
        this.manager = manager;
    }
    createOne = async (data) => await this.manager.createOne(data);
    readAll = async () => await this.manager.readAll();
    readById = async (pid) => await this.manager.readById(pid);
    readByFilter = async (filter) => await this.manager.readByFilter(filter);
    updateOneById = async (pid, data) => await this.manager.updateById(pid, data);
    destroyById = async (pid) => await this.manager.destroyById(pid);
}

const cartsService = new Service(cartsManager);
const productsService = new Service(productsManager);
const usersService = new Service(usersManager);

export { cartsService, productsService, usersService };