idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

dbName = 'employeesDb';
dbVersion = 1;
tableNames = ['employees'];


function initDb(){
    idb.open(dbName, dbVersion).onupgradeneeded = event=>{
        let db = event.target.result;
        tableNames.forEach(tableName => {
            if(!Array.from(db.objecttableNames).includes(tableName)){
                db.createObjectStore(tableName, {keyPath: "id"});
            }
        });
    }
}


function add(tableName){
    let datarow = getDatarowFromMyForm();
    
    idb.open(dbName, dbVersion).onsuccess = dbEvent => {
        let addRequest = dbEvent.target.result.transaction([tableName], "readwrite").objectStore(tableName).add(datarow);
        addRequest.onsuccess = addEvent => {
            document.querySelector('main').innerHTML = JSON.stringify(datarow);
            resetMyForm()
        }
        addRequest.onerror = addEvent => {
            document.querySelector('main').innerHTML = `unable to add this datarow`;
        }
    }
}


function read(tableName){
    let datarow = getDatarowFromMyForm();
    idb.open(dbName, dbVersion).onsuccess = dbEvent => {
        
        let getRequest = dbEvent.target.result.transaction([tableName]).objectStore(tableName).get(datarow.id);
        getRequest.onsuccess = getEvent => {
            tableDatarow = getEvent.target.result;
            document.querySelector('main').innerHTML = JSON.stringify(tableDatarow);
        }
    }
}


function readAll(tableName) {
    let datarows = [];
    idb.open(dbName, dbVersion).onsuccess = (dbEvent) => {
        let cursorRequest = dbEvent.target.result.transaction([tableName]).objectStore(tableName).openCursor()
        cursorRequest.onsuccess = cursorEvent=>{
            var cursor = cursorEvent.target.result;
            
            if(cursor) {
                datarows.push(cursor.value);
                cursor.continue();
            } else {
                document.querySelector('main').innerHTML = JSON.stringify(datarows);
            }
        }
    }
}


function remove(tableName) {
    let datarow = getDatarowFromMyForm();
    idb.open(dbName, dbVersion).onsuccess = dbEvent => {
        let deleteRequest = dbEvent.target.result.transaction([tableName],'readwrite').objectStore(tableName).delete(datarow.id);
        deleteRequest.onsuccess = deleteEvent=>{
            document.querySelector('main').innerHTML = `employee with id ${datarow.id} has been removed from ${tableName}`;
        }
    }
}


function removeWithInfo(tableName){
    let datarow = getDatarowFromMyForm();
    idb.open(dbName, dbVersion).onsuccess = dbEvent => {
        let getRequest = dbEvent.target.result.transaction([tableName]).objectStore(tableName).get(datarow.id);
        
        getRequest.onsuccess = getEvent => {
            tableDatarow = getEvent.target.result;
            if(tableDatarow===undefined){
                document.querySelector('main').innerHTML = `The datarow with id of '${datarow.id}' doesn't exist so cannot be deleted`;
            } else {
                let deleteRequest = dbEvent.target.result.transaction([tableName],'readwrite').objectStore(tableName).delete(datarow.id);
            
                deleteRequest.onsuccess = deleteEvent=>{
                    document.querySelector('main').innerHTML = `${JSON.stringify(tableDatarow)} no longer exists`;
                }
            }
        }
    }
}

