function getDatarowFromMyForm(){
    let datarow = {
        id: document.getElementById('empId').value,
        name: document.getElementById('empName').value,
        age: document.getElementById('empAge').value,
        email: document.getElementById('empEmail').value
    };
    
    return datarow.id=='' ? undefined : datarow;
}

function resetMyForm(){
    document.getElementById('empId').value = '';
    document.getElementById('empName').value = '';
    document.getElementById('empAge').value = '';
    document.getElementById('empEmail').value = '';
}

function resetMain(){
    document.querySelector('main').innerHTML = '';
}

function showInMain(msg){
    `
        ${document.querySelector('main').innerHTML = typeof(msg)=='string' ? msg : JSON.stringify(msg,null,2)}
    `;
}
