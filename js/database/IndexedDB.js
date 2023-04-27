// variables
let idSelected;
let dbName = "CriptosDB";

//show encript/decript user session
const keySecret='mySecretKey'; 

//tables
/*users=[{
    idUser:"",
    email:"",
    name:"",
    key:""
}]
usersPasswd=[{
    idUser:"",
    password: ""
}]*/
let historySell={ //history sells and buys
    idCripto:'',
     //idUser
    investedPrice:"",
    dateSold:"",
    dateInvested:'',
    earned:'',
    coinPrice:''
}
let criptos={
    idCripto:"",
    //idUser
    investedPrice:"",
    date:"",
    coinPrice:''
        
}
let checkPrice={
    idCripto:"",
    //idUser
    coinPrice:''
        
}/*
Coins=[{
    id:"bitcoin",
    name: "Bitcoin",
    api_symbol: "bitcoin",
    symbol: "BTC",
    market_cap_rank: 1,
    thumb: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png",
    large: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
            
}]*/

/*user logueado his data */
let user={
    data:{},
    historySell:[],
    criptos:[],
    checkPrice:[],
    identified:''
}

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
            const checkPrice = db.createObjectStore('checkPrice', { keyPath: 'id', autoIncrement: false });
            const coins = db.createObjectStore('coins', { keyPath: 'id', autoIncrement: false });
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
        const transaction = await this.db.transaction([table], 'readwrite');
        const store = await transaction.objectStore(table);


        // get object by ID
        let getRequest = store.get(id);
        return new Promise((resolve, reject)=>{
            getRequest.onsuccess =async () => {
                // update object
                let updatedObj = getRequest.result;
                updatedObj.data=JSON.stringify(objeto)
            
                let request = await store.put(updatedObj);

                request.onsuccess = () => {
                    console.log('Update successful');
                    resolve({status:true, message:'Update successful'});
                };

                request.onerror = (event) => {
                    console.log('Error to update object:', event);
                    reject({status:false, message:'Error to update objec'});
                };

                getRequest.onerror = (event) => {
                    console.log('Error to get object: ', event);
                    reject({status:false, message:'Error to get object'});
                };
                
            }
        });
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
