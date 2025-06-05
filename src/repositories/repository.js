import { cartsManager, productsManager, usersManager } from "../dao/factory.js";
import CartsDTO from "../dto/carts.dto.js";
import ProductsDTO from "../dto/products.dto.js";
import UsersDTO from "../dto/users.dto.js";

class Repository {
    constructor(manager, Dto) {
        this.manager = manager;
        this.Dto = Dto;
    }
    createOne = async (data) => await this.manager.createOne(new this.Dto(data));
    readAll = async () => await this.manager.readAll();
    readById = async (pid) => await this.manager.readById(pid);
    readByFilter = async (filter) => await this.manager.readByFilter(filter);
    updateById = async (pid, data) => await this.manager.updateById(pid, data);
    destroyById = async (pid) => await this.manager.destroyById(pid);
}

const cartsRepository = new Repository(cartsManager, CartsDTO);
const productsRepository = new Repository(productsManager, ProductsDTO);
const usersRepository = new Repository(usersManager, UsersDTO);

export { cartsRepository, productsRepository, usersRepository };