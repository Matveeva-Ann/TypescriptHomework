const regLogin = /[a-zA-Z]+/;
const regPassword = /\S{6,}/;
const regEmail = /^\S+@[a-zA-Z]{2,}.[a-zA-Z]{2,}/;
const form = document.forms[0];
const butn = document.querySelector('.form-button');
const massage = document.querySelector('.massage');
const recordId = document.querySelector('.recordId');
const tableContent = document.querySelector('#tableContent');
let usersArr = [];
let id = 1;
class User {
    _id;
    login;
    password;
    email;
    constructor(id, login, password, email) {
        this._id = id;
        this.login = login;
        this.password = password;
        this.email = email;
    }
    set id(id) {
        this._id = id;
    }
    get id() {
        return this._id;
    }
}
form.addEventListener('submit', function (event) {
    event.preventDefault();
    checkСorrect();
});
function checkСorrect() {
    if (!regLogin.test(form[1].value) || !regPassword.test(form[2].value) || !regEmail.test(form[3].value)) {
        massage.style.display = 'block';
        if (!regLogin.test(form[1].value)) {
            massage.textContent = '* Login повинен складатися лише з букв';
        }
        else if (!regPassword.test(form[2].value)) {
            massage.textContent = '* Довжина password повинна бути більше 6 символів та не включати пробіли';
        }
        else if (!regEmail.test(form[3].value)) {
            massage.textContent = '* Не вірний формат Email';
        }
    }
    else {
        massage.style.display = 'none';
        massage.textContent = '';
        createArrUsers();
        createTable();
        butn.innerText = 'Add user';
        form[0].setAttribute("data", '');
    }
}
function createArrUsers() {
    const formData = new FormData(form);
    if (form[0].getAttribute("data") === "") {
        form[0].setAttribute("data", `${id++}`);
        const userUnit = new User(form[0].getAttribute("data"), formData.get("login"), formData.get("password"), formData.get("email"));
        if (!usersArr.some(elem => elem.email == formData.get("email"))) {
            usersArr.push(userUnit);
            massage.style.display = 'none';
            massage.textContent = '';
            form.reset();
        }
        else {
            massage.style.display = 'block';
            massage.textContent = '* Користувач з таким Email вже зареєстрований';
        }
    }
    else {
        const userid = form[0].getAttribute("data");
        usersArr = usersArr.map(function (elem) {
            if (elem.id === userid) {
                elem.id = form[0].getAttribute("data");
                elem.login = formData.get("login");
                elem.password = formData.get("password");
                elem.email = formData.get("email");
            }
            return elem;
        });
    }
}
function createTable() {
    tableContent.textContent = "";
    for (let i = 0; i < usersArr.length; i++) {
        const newRow = document.createElement("tr");
        for (let i = 0; i < form.length + 1; i++) {
            const newTd = document.createElement("td");
            newRow.appendChild(newTd);
        }
        newRow.setAttribute("data", usersArr[i].id);
        const elementAccess = newRow.firstElementChild.nextElementSibling;
        elementAccess.textContent = `${usersArr[i].login}`;
        elementAccess.nextElementSibling.textContent = `${usersArr[i].password}`;
        elementAccess.nextElementSibling.nextElementSibling.textContent = `${usersArr[i].email}`;
        newRow.lastElementChild.previousElementSibling.appendChild(createButtonEdit());
        newRow.lastElementChild.appendChild(createButtonDel());
        tableContent.appendChild(newRow);
    }
}
function createButtonEdit() {
    const btnEdit = document.createElement("buttom");
    btnEdit.classList.add('buttonEdit');
    btnEdit.textContent = 'Edit';
    return btnEdit;
}
function createButtonDel() {
    const btnDelete = document.createElement("buttom");
    btnDelete.classList.add('buttonDelete');
    btnDelete.textContent = 'Delete';
    return btnDelete;
}
tableContent.addEventListener("click", function (event) {
    let elemId = event.target.parentElement.parentElement.getAttribute('data');
    if (event.target.innerText === "Delete") {
        usersArr = usersArr.filter((elem) => elem.id !== elemId);
        createTable();
    }
    else if (event.target.innerText === "Edit") {
        const elementAccess = event.target.parentElement.parentElement.firstElementChild;
        butn.innerText = 'Edit data';
        form[0].setAttribute("data", `${elemId}`);
        form[1].value = elementAccess.nextElementSibling.textContent;
        form[2].value = elementAccess.nextElementSibling.nextElementSibling.textContent;
        form[3].value = elementAccess.nextElementSibling.nextElementSibling.nextElementSibling.textContent;
    }
});
