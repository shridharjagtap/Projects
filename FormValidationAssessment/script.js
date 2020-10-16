const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');



function showSuccess(input){
    const formControl = input.parentElement;
    formControl.className = 'form-control success'
}

function showError(input, message){
    const formControl = input.parentElement;
    formControl.className = 'form-control error'
    const small = formControl.querySelector('small');
    small.innerText = message;
}

function checkEmail(input){
    const regexPattern = /\S+@\S+\.\S+/
    if (regexPattern.test(input.value)){
        showSuccess(input)
    } else {
        showError(input, 'Email is not valid')
    }
}

function validateInputs(inputArr){
    inputArr.forEach( function (input){
        if (input.value === ""){
            showError(input, `${getElementName(input)} is required`);
        } else {
            showSuccess(input);
        }
    });
}

function getElementName(input){
    return input.id.charAt(0).toUpperCase() + input.id.slice(1)
}

function checkLength(input, min, max){
    if (input.value.length > min && input.value.length < max) {
        showSuccess(input)
    } else {
        showError(input, `${getElementName(input)} must be in-between ${min} to  ${max} char.`  )
    }

}

function matchPassword(input, input2){
    if (input.value !== input2.value){
        showError(input2, 'Password does not match')
    }
}

form.addEventListener('submit', function(e){
    e.preventDefault();
    validateInputs([username, email, password, password2])
    checkEmail(email)
    checkLength(username, 6, 15)
    checkLength(password, 6, 26)
    matchPassword(password, password2)
})