import { cartsRepository } from "../repositories/repository.js";

class CartsService {
    constructor() {
        this.manager = cartsRepository;
    }
    createOne = async (data) => await this.manager.createOne(data);
    readAll = async () => await this.manager.readAll();
    readByFilter = async (filter) => await this.manager.readByFilter(filter);
    readById = async (cid) => await this.manager.readById(cid);
    updateById = async (cid, data) => await this.manager.updateById(cid, data);
    destroyById = async (cid) => await this.manager.destroyById(cid);
    productsCart = async (cid) => await this.manager.readById(cid);
}

const cartsService = new CartsService();

export default cartsService;
