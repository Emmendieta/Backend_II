import { productsRepository } from "../repositories/repository.js";

class ProductsService {
    constructor() {
        this.manager = productsRepository;
    }
    createOne = async (data) => await this.manager.createOne(data);
    readAll = async () => await this.manager.readAll();
    readById = async (pid) => await this.manager.readById(pid);
    updateOneById = async (pid, data) => await this.manager.updateById(pid, data);
    destroyById = async (pid) => await this.manager.destroyById(pid);
}

const productsService = new ProductsService();

export default productsService;