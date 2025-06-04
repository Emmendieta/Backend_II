import { cartsManager, productsManager, usersManager } from "../dao/factory.js";

class Repository {
    constructor(manager) {
        this.manager = manager;
    }
    createOne = async (data) => await this.manager.createOne(data);
    readAll = async () => await this.manager.readAll();
    readById = async (pid) => await this.manager.readById(pid);
    readByFilter = async (filter) => await this.manager.readByFilter(filter);
    updateById = async (pid, data) => await this.manager.updateById(pid, data);
    destroyById = async (pid) => await this.manager.destroyById(pid);
}

const cartsRepository = new Repository(cartsManager);
const productsRepository = new Repository(productsManager);
const usersRepository = new Repository(usersManager);

export { cartsRepository, productsRepository, usersRepository };