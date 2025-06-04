import { cartsRepository, productsRepository, usersRepository } from "../repositories/repository.js";

class Service {
    constructor(repository) {
        this.repository = repository;
    }
    createOne = async (data) => await this.repository.createOne(data);
    readAll = async () => await this.repository.readAll();
    readById = async (pid) => await this.repository.readById(pid);
    readByFilter = async (filter) => await this.repository.readByFilter(filter);
    updateById = async (pid, data) => await this.repository.updateById(pid, data);
    destroyById = async (pid) => await this.repository.destroyById(pid);
}

const cartsService = new Service(cartsRepository);
const productsService = new Service(productsRepository);
const usersService = new Service(usersRepository);

export { cartsService, productsService, usersService };