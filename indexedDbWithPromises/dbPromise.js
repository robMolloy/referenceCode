function openIndexedDB(){
    let indexedDBRequest = indexedDB.open(dbName);
    return new Promise((resolve, reject) => {
        indexedDBRequest.onsuccess = dbEvent => {resolve(dbEvent.target.result);}
		indexedDBRequest.onerror = () => {reject(Error("IndexedDb request error"));}
    });
}


/* *********  Generic Table Functions  ************** */

async function getDatarow(tableName,id){
    let idb = await openIndexedDB();
    
    return new Promise((resolve, reject) => {
        let getRequest = idb.transaction([tableName]).objectStore(tableName).get(id);
        
        getRequest.onsuccess = getEvent => {
            tableDatarow = getEvent.target.result;
            resolve(tableDatarow);
        }
    });
}


async function addDatarow(tableName,datarow){
    let idb = await openIndexedDB();
    
    return new Promise((resolve, reject) => {
        let addRequest = idb.transaction([tableName], "readwrite").objectStore(tableName).add(datarow);
        
        addRequest.onsuccess = addEvent => {resolve(datarow);}
        addRequest.onerror = addEvent => {resolve(false);}
    });
}


async function changeDatarow(tableName,datarow){
    let idb = await openIndexedDB();
    
    return new Promise((resolve, reject) => {
        let putRequest = idb.transaction([tableName], "readwrite").objectStore(tableName).put(datarow);
        
        putRequest.onsuccess = putEvent => {resolve(datarow);}
        putRequest.onerror = putEvent => {resolve(false);}
    });
}


async function getAllDatarows(tableName){
    let datarows = [];
    let idb = await openIndexedDB();
    
    return new Promise((resolve, reject) => {
        let iterateRequest = idb.transaction([tableName]).objectStore(tableName).openCursor()

        iterateRequest.onsuccess = iterateEvent => {
            let cursor = iterateEvent.target.result;
            if(cursor) {datarows.push(cursor.value);cursor.continue();}
            else {resolve(datarows);}
        }
        //~ iterateRequest.onerror = iterateEvent => {resolve(false)}
    });
}


async function removeDatarow(tableName,id) {
    let idb = await openIndexedDB();
    
    return new Promise((resolve, reject) => {
        let deleteRequest = idb.transaction([tableName],'readwrite').objectStore(tableName).delete(id);
        
        deleteRequest.onsuccess = deleteEvent => {resolve(true);}
        deleteRequest.onerror = deleteEvent => {resolve(true);}
    });
}




/* *********** Employee Table Functions *********** */

async function showEmployee(id=''){
    id = id=='' ? getDatarowFromMyForm().id : id;
    let tableDatarow = await getDatarow('employees',id);
    
    let message = tableDatarow!==undefined ? tableDatarow : `No employee exists with id: ${id}`;
    showInMain(message);
}


async function showAllEmployees(){
    let tableDatarows = await getAllDatarows('employees');
    showInMain(tableDatarows.map(datarow=>`<div>${datarow.id}: ${JSON.stringify(datarow)}</div>`).join(''));
}


async function addEmployee(datarow=''){
    datarow = datarow=='' ? getDatarowFromMyForm() : datarow;
    
    //~ let tableDatarow = await getDatarow('employees',datarow.id);
    //~ if(tableDatarow!==undefined){
        //~ showInMain(`An employee already exists with that id: ${JSON.stringify(tableDatarow)}`);
        //~ return;
    //~ }
    
    let addResponse = await addDatarow('employees',datarow);
    //~ tableDatarow = await getDatarow('employees',datarow.id);
    
    //~ appendToMain(employeePanel(datarow));
    //~ resetMyForm();
}


async function removeEmployee(id=''){
    id = id=='' ? getDatarowFromMyForm().id : id;
    
    let tableDatarow = await getDatarow('employees',id);
    if(tableDatarow===undefined){
        showInMain(`An employee does not exist with that id: ${id}`);
        return;
    }
    
    let removeResponse = await removeDatarow('employees',id);
    let message = `employee removed ${removeResponse ? `successfully` : `unsuccessfully`}`
    showInMain(message);
}


async function changeEmployee(datarow=''){
    datarow = datarow=='' ? getDatarowFromMyForm() : datarow;
    
    let tableDatarow = await getDatarow('employees',datarow.id);
    if(tableDatarow===undefined){
        showInMain(`An employee does not exist with that id: ${datarow.id}`);
        return;
    }
    
    let changeResponse = await changeDatarow('employees',datarow);
    let message = `employee changed ${changeResponse ? `successfully` : `unsuccessfully`}`
    showInMain(message);
}



