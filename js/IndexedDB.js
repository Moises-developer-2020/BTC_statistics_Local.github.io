// variables
let idSelected;
let dbName = "CriptosDB";
let sessionUser;

//tables
users=[{
    idUser:"",
    email:"",
    name:"",
    key:""
}]
usersPasswd=[{
    idUser:"",
    password: ""
}]
historySell=[{
    idUser:"",
    savedPrice:"",
    dateSold:""
}]
criptos=[{
    idCripto:"",
    idUser:"",
    savedPrice:"",
    date:""
        
}]


//get localBD
function DB(dbName) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(dbName, 1);

        request.onerror = () => {
            reject('No se pudo abrir la base de datos');
        };

        request.onsuccess = () => {
            const db = request.result;
            resolve(db);
        };

        // Create the database if it dont not exist
        request.onupgradeneeded = () => {
            const db = request.result;
            const users = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
            const usersPasswd = db.createObjectStore('usersPasswd', { keyPath: 'id', autoIncrement: false });
            const historySell = db.createObjectStore('historySell', { keyPath: 'id', autoIncrement: false });
            const criptos = db.createObjectStore('criptos', { keyPath: 'id', autoIncrement: false });
            const coins = db.createObjectStore('coins', { keyPath: 'id', autoIncrement: true });
        };
    });
}

class MyFunctions {
    constructor(db) {
        this.db = db;
    }

    // create a new object
    async createObjeto(table, objeto) {
        const transaction = await this.db.transaction([table], 'readwrite');
        const store = await transaction.objectStore(table);
        const request = await store.add(objeto);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log('Objeto creado con éxito');
                const result = request.result;
                resolve(result);
            };
    
            request.onerror = (event) => {
                console.log('Error al crear el objeto', event);
                reject(request.error);
            };
        })
    }

    // update object
    async updateObjeto(table, id, objeto) {
        const transaction = this.db.transaction([table], 'readwrite');
        const store = transaction.objectStore(table);


        // get object by ID
        let getRequest = store.get(id);

        getRequest.onsuccess = () => {
            // update object
            let updatedObj = getRequest.result;
            updatedObj.nombre = objeto.nombre;
            //updatedObj.propiedad2 = objeto.propiedad2;

            let request = store.put(updatedObj);

            request.onsuccess = () => {
                console.log('Update successful');
            };

            request.onerror = (event) => {
                console.log('Error to update object:', event);
            };

            getRequest.onerror = (event) => {
                console.log('Error to get object: ', event);
            };
        }
    }

    // search by ID
    async searchObjetoById(table, id) {
        const transaction = await this.db.transaction([table], 'readonly');
        const store = await transaction.objectStore(table);
        const request = await store.get(parseInt(id));

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const result = request.result;
                resolve(result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });

    }

    // delete by ID
    async deleteObjetoPorId(table, id) {
        const transaction = await this.db.transaction([table], 'readwrite');
        const store = await transaction.objectStore(table);
        const request = await store.delete(id);

        request.onsuccess = () => {
            console.log('Delete succesful');
        };

        request.onerror = (event) => {
            console.log('Error to delete object', event);
        };
    }
    async readAllData(table) {
        const transaction = this.db.transaction([table], "readonly");
        const objectStore = transaction.objectStore(table);
        const request = objectStore.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const result = request.result;
                resolve(result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
        
    }
}


// call update, delete, add functions 
//examples
// AddButton.addEventListener("click", async function () {
//     const text = inputAdd.value.trim();
//     if (text === "") {
//         return;
//     }
//     await fecthLocalData('users', 'add', { value: { nombre: text } });
//    

// });
// DeleteButton.addEventListener("click", async function () {
//     await fecthLocalData('users', 'remove', { id: idSelected });

// });
// UpdateButton.addEventListener("click", async function () {

//     await fecthLocalData('users', 'update', { id: idSelected, value: { nombre: inputUpdate.value } });
//     
// })
// SearchButton.addEventListener("click", async function () {

//     const result = await fecthLocalData('users', 'showId', { id: idSelected });
//     console.log(result)


// });