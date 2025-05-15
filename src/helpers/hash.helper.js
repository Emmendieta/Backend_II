import { genSaltSync, hashSync, compareSync } from "bcrypt";

const createHash = (password) => hashSync(password, genSaltSync(15));
const compareHash = (password, passwordDB) => compareSync(password, passwordDB);

export { createHash, compareHash };