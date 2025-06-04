const { PERSISTENCE } = process.env;

let dao = {};

switch (PERSISTENCE) {
    case "memory":
        console.log("Logica pendiente de memory");
        {
            const { usersManager, productsManager, cartsManager } = await import("./memory/dao.memory.js");
            dao = { usersManager, productsManager, cartsManager };
        };
        break;
    case "fs":
        console.log("Logica pendiente de fs");
        {
            const { usersManager, productsManager, cartsManager } = await import("./fs/dao.fs.js");
            dao = { usersManager, productsManager, cartsManager };
        };
        break;
    default:
        {
            const { usersManager, productsManager, cartsManager } = await import("./mongo/dao.mongo.js");
            dao = { usersManager, productsManager, cartsManager }
        };
        break;
};

const { usersManager, productsManager, cartsManager } = dao;

export { usersManager, productsManager, cartsManager };
export default dao;