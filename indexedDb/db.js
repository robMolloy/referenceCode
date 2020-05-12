/* 
naming convention:
    >in this example the name "table" is used instead of "stores"
        - using a verb as a noun is confusing when unfamiliar
    >datarow - the value placed into a row of the table in the db
*/


//~ store idb globally
const idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//~ dbinfo
const dbName = 'employeesDb';
const dbVersion = 1;
//~ customers not used in this example 
const tableNames = ['employees','customers'];


//~ function called on page load (Ref: tables = stores, see naming convention)
//~ if the dbName does not exist a new db will be set up with the above tables
//~ if the dbVersion is greater than the current version, the above tables will be assigned to the existing db
function initDb(){
    idb.open(dbName, dbVersion).onupgradeneeded = event => {
        console.log('updating DB');
        let db = event.target.result;
        tableNames.forEach(tableName => {
            if(!Array.from(db.objectStoreNames).includes(tableName)){
                db.createObjectStore(tableName, {keyPath: "id"});
            }
        });
    }
}

//~ function adds a datarow to the table passed in argument
function add(tableName){
    let datarow = getDatarowFromMyForm();
    if(datarow===undefined){document.querySelector('main').innerHTML = 'Datarow does not have an ID';return;}
    
    //~ open an idb connection
    idb.open(dbName).onsuccess = dbEvent => {
        //~ request to add something to a table
        let addRequest = dbEvent.target.result.transaction([tableName], "readwrite").objectStore(tableName).add(datarow);
        
        //~ if addRequest succesful print message and reset form
        addRequest.onsuccess = addEvent => {
            document.querySelector('main').innerHTML = JSON.stringify(datarow);
            resetMyForm()
        }
        //~ if addRequest errors, print error message
        addRequest.onerror = addEvent => {
            document.querySelector('main').innerHTML = `unable to add this datarow - id may be repeated`;
        }
    }
}

//~ function updates a datarow to the table passed in argument
function update(tableName){
    let datarow = getDatarowFromMyForm();
    if(datarow===undefined){document.querySelector('main').innerHTML = 'Datarow does not have an ID';return;}
    
    //~ open an idb connection
    idb.open(dbName).onsuccess = dbEvent => {
        //~ request to update something to a table
        let putRequest = dbEvent.target.result.transaction([tableName], "readwrite").objectStore(tableName).put(datarow);
        
        //~ if putRequest succesful print message and reset form
        putRequest.onsuccess = putEvent => {
            document.querySelector('main').innerHTML = JSON.stringify(datarow);
            resetMyForm()
        }
        //~ if putRequest errors, print error message
        putRequest.onerror = putEvent => {
            document.querySelector('main').innerHTML = `unable to add this datarow - id may be repeated`;
        }
    }
}


//~ function reads a datarow from the table passed as argument
function read(tableName){
    let datarow = getDatarowFromMyForm();
    if(datarow===undefined){document.querySelector('main').innerHTML = 'Datarow does not have an ID';return;}
    
    //~ open an idb connection
    idb.open(dbName).onsuccess = dbEvent => {
        //~ request to get something from a table
        let getRequest = dbEvent.target.result.transaction([tableName]).objectStore(tableName).get(datarow.id);
        
        //~ if getRequest succesful...
        getRequest.onsuccess = getEvent => {
            tableDatarow = getEvent.target.result;
            
            //~ check if returned datarow exists 
            if(tableDatarow!==undefined)
                //~ if exists print datarow
                {document.querySelector('main').innerHTML = JSON.stringify(tableDatarow);}
            else
                //~ else print error message
                {document.querySelector('main').innerHTML = `The datarow with id of '${datarow.id}' doesn't exist`;}
        }
    }
}


//~ function reads all datarows from the table passed as argument
function readAll(tableName) {
    //~ open an idb connection
    idb.open(dbName, dbVersion).onsuccess = dbEvent => {
        //~ request to iterate over table
        let iterateRequest = dbEvent.target.result.transaction([tableName]).objectStore(tableName).openCursor()
        
        //~ if iterateRequest succesful...
        iterateRequest.onsuccess = iterateEvent => {
            let datarows = [];
            let cursor = iterateEvent.target.result;
            
            //~ check if cursor is currently iterating on a datarow - this will loop through iterations
            if(cursor) {
                //~ if on datarow, add datarow to datarows array and move to cursor to next datarow
                datarows.push(cursor.value);
                cursor.continue();
            } else {
                //~ once iterations complete - print datarows
                document.querySelector('main').innerHTML = JSON.stringify(datarows);
            }
        }
    }
}


//~ function removes datarow from the table passed as argument
function remove(tableName) {
    let datarow = getDatarowFromMyForm();

    //~ open an idb connection
    idb.open(dbName, dbVersion).onsuccess = dbEvent => {
        //~ request to delete something in a table
        let deleteRequest = dbEvent.target.result.transaction([tableName],'readwrite').objectStore(tableName).delete(datarow.id);
        
        //~ if deleteRequest succesful...
        deleteRequest.onsuccess = deleteEvent => {
            //~ print success message
            document.querySelector('main').innerHTML = `employee with id ${datarow.id} has been removed from ${tableName}`;
        }
    }
}


//~ function removes datarow from the table passed as argument
//~ like remove() but gives information about the removal or unsuccessful removal
function removeWithInfo(tableName){
    let datarow = getDatarowFromMyForm();
    
    //~ open an idb connection
    idb.open(dbName, dbVersion).onsuccess = dbEvent => {
        //~ request to get something from the table
        let getRequest = dbEvent.target.result.transaction([tableName]).objectStore(tableName).get(datarow.id);
        
        //~ if getRequest succesful...
        getRequest.onsuccess = getEvent => {
            //~ store datarow from table
            let tableDatarow = getEvent.target.result;
            
            //~ check if datarow exists... 
            if(tableDatarow===undefined){
                //~ print error message if it does not exist
                document.querySelector('main').innerHTML = `The datarow with id of '${datarow.id}' doesn't exist so cannot be deleted`;
            } else {
                //~ if datarow exists request to delete something from the table
                let deleteRequest = dbEvent.target.result.transaction([tableName],'readwrite').objectStore(tableName).delete(datarow.id);
            
                //~ if deleteRequest succesful print message
                deleteRequest.onsuccess = deleteEvent=>{
                    document.querySelector('main').innerHTML = `${JSON.stringify(tableDatarow)} no longer exists`;
                }
            }
        }
    }
}

