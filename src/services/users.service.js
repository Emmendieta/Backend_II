import { usersRepository } from "../repositories/repository.js";

class UsersService {
    constructor() {
        this.manager = usersRepository;
    }
    createOne = async (data) => await this.manager.createOne(data);
    readAll = async () => await this.manager.readAll();
    readById = async (pid) => await this.manager.readById(pid);
    readByFilter = async (filter) => await this.manager.readByFilter(filter);
    updateOneById = async (pid, data) => await this.manager.updateById(pid, data);
    destroyById = async (pid) => await this.manager.destroyById(pid);
}

const usersService = new UsersService();

export default usersService;