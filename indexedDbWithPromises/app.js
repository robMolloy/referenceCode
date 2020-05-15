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


let firstNames = ['Alice','Betty','Chris','Derek','Eli','Fred','Gary','Harry','Ian'];
let lastNames = ['Brimble','Jones','Goodwin','Foyle','Molloy','McOneill']

async function populateDb(){
    let timeStart = Date.now() / 1000 | 0;
    
    for(let i=0;i<100;i++){
        let randomEmployee = randomEmployeeDatarow();
        await addDatarow('employees',randomEmployee);
        appendToMain(employeePanel(randomEmployee));
        //~ addRandomEmployee();
        console.log(i);
    }
    
    let timeFinish = Date.now() / 1000 | 0;
    console.log(timeFinish - timeStart);
}


function randomEmployeeDatarow(){
    let name = `${firstNames[Math.floor(Math.random()*firstNames.length)]} ${lastNames[Math.floor(Math.random()*lastNames.length)]}`;
    let email = name.split(' ').join('') + '@aol.uk';
    let age = Math.floor(Math.random()*100);
    let id = `${Math.floor(Math.random()*1000)}_${Math.random().toString(36).substr(2,7)}`;
    
    return {name:name,email:email,age:age,id:id};
}


function addRandomEmployee(){
    addEmployee(randomEmployeeDatarow());
}


function employeePanel(employeeDatarow){
    return `
        <div class="panel">
            <div>Employee</div>
            <div>Id: ${employeeDatarow.id}</div>
            <div>Name: ${employeeDatarow.name}</div>
            <div>Email: ${employeeDatarow.email}</div>
            <div>Age: ${employeeDatarow.age}</div>
        </div>
    `;
}


function appendToMain(html){
	document.querySelector('main').insertAdjacentHTML('beforeend',html);
}
