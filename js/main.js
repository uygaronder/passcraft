//fill password fields with password

let az = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
let AZ = az.map(x => x.toUpperCase());
let num = ['0','1','2','3','4','5','6','7','8','9'];
let sym = ['!','@','#','$','%','^','&','*','(',')','_','-','+','=','[',']','{','}','|',';',':','<','>','?','/','.',','];

let pass = '';
let passLength = 16;
let passArr = [];

let defValues = {
    theme: "light",
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
    length: 16
}

const themeSelector = document.getElementById("themeSelector");
const themeSelectorCheckbox = document.getElementById("themeSelectorCheckbox");
const sunIcon = document.getElementById("sunIcon");
const moonIcon = document.getElementById("moonIcon");

themeSelector.addEventListener("click", () => {
    if(themeSelectorCheckbox.checked) {
        themeSelectorCheckbox.checked = false;
        defValues.theme = "light";
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        sunIcon.classList.add("active");
        moonIcon.classList.remove("active");
    } else {
        themeSelectorCheckbox.checked = true;
        defValues.theme = "dark";
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        sunIcon.classList.remove("active");
        moonIcon.classList.add("active");
    }
    saveDefaultValues();
});

async function loadDefaultValues() {
    chrome.storage.local.get("defaultValues", (result) => {
        if(result.defaultValues != undefined) {
            defValues = result.defaultValues;
            console.log(defValues);
            setDefaultValues();
        } else {
            chrome.storage.local.set({["defaultValues"]: defValues}).then(() => {
                setDefaultValues();
            });
        }
    });
}

async function saveDefaultValues() {
    defValues.theme = themeSelectorCheckbox.checked ? "dark" : "light"; 
    defValues.lowercase = document.getElementById("lowercase").checked;
    defValues.uppercase = document.getElementById("uppercase").checked;
    defValues.numbers = document.getElementById("numbers").checked;
    defValues.symbols = document.getElementById("symbols").checked;
    defValues.length = document.getElementById("lengthInput").value;
    chrome.storage.local.set({["defaultValues"]: defValues})
}

const setDefaultValues = () => {
    setTheme();
    document.getElementById("lowercase").checked = defValues.lowercase;
    document.getElementById("uppercase").checked = defValues.uppercase;
    document.getElementById("numbers").checked = defValues.numbers;
    document.getElementById("symbols").checked = defValues.symbols;
    document.getElementById("lengthInput").value = defValues.length;
    document.getElementById("lengthSlider").value = defValues.length;
    generatePassword();
}

const setTheme = () => {
    if(defValues.theme == "dark") {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        themeSelectorCheckbox.checked = true;
        sunIcon.classList.remove("active");
        moonIcon.classList.add("active");
    } else {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        themeSelectorCheckbox.checked = false;
        sunIcon.classList.add("active");
        moonIcon.classList.remove("active");
    }
}

document.getElementById("lowercase").addEventListener("click", () => {
    saveDefaultValues();
    generatePassword();
});

document.getElementById("uppercase").addEventListener("click", () => {
    saveDefaultValues();
    generatePassword();
});

document.getElementById("numbers").addEventListener("click", () => {
    saveDefaultValues();
    generatePassword();
});

document.getElementById("symbols").addEventListener("click", () => {
    saveDefaultValues();
    generatePassword();
});

document.getElementById("lengthInput").addEventListener("input", () => {
    saveDefaultValues();
    generatePassword();
});

document.getElementById("lengthSlider").addEventListener("input", () => {
    saveDefaultValues();
    generatePassword();
});

const passLengthInput = document.getElementById("lengthInput");
let passLengthInputSlider = document.getElementById("lengthSlider");
document.getElementById("resetButton").addEventListener("click", () => {
    generatePassword();
    document.getElementById("resetButton").classList.add("resetButtonTextAnimation");
    setTimeout(() => {
        document.getElementById("resetButton").classList.remove("resetButtonTextAnimation");
    }, 200);
});
document.getElementById("copyButton").addEventListener("click", () => copyPassword());


passLengthInputSlider.addEventListener("input", () => {
    passLengthInput.value = passLengthInputSlider.value;
    generatePassword();
});

passLengthInput.addEventListener("input", () => {
    if(passLengthInput.value > 50) {
        passLengthInput.value = 50;
    }
    passLengthInputSlider.value = passLengthInput.value;
    generatePassword();
});

function generatePassword() {
    passLength = passLengthInputSlider.value;
    passArr = [];
    pass = '';

    if (document.getElementById("lowercase").checked) {
        passArr = passArr.concat(az);
    }
    if (document.getElementById("uppercase").checked) {
        passArr = passArr.concat(AZ);
    }
    if (document.getElementById("numbers").checked) {
        passArr = passArr.concat(num);
    }
    if (document.getElementById("symbols").checked) {
        passArr = passArr.concat(sym);
    }

    for (let i = 0; i < passLength; i++) {
        pass += passArr[Math.floor(Math.random() * passArr.length)];
    }

    if(document.getElementById("lowercase").checked && pass.match(/[a-z]/ ) == null && passLengthInput.value >= 4){
        generatePassword();
    }
    if(document.getElementById("uppercase").checked && pass.match(/[A-Z]/) == null && passLengthInput.value >= 4){
        generatePassword();
    }
    if(document.getElementById("numbers").checked && pass.match(/[0-9]/ ) == null && passLengthInput.value >= 4){
        generatePassword();
    }
    if(document.getElementById("symbols").checked && pass.match(/[^a-zA-Z0-9]/) == null && passLengthInput.value >= 4){
        generatePassword();
    }
    renderStrengthBar(pass);
    document.getElementById("passwordOutputText").value = pass;
}

function passwordStrengthCheck(password){
    let strength = 0;
    if(password.length >= 8) {
        strength++;
    }
    if(password.length >= 16) {
        strength++;
    }
    if(password.length >= 20) {
        strength++;
    }
    if(password.match(/[a-z]/)){
        strength++;
    }
    if(password.match(/[A-Z]/)){
        strength++;
    }
    if(password.match(/[0-9]/)){
        strength++;
    }
    if(password.match(/[^a-zA-Z0-9]/)){
        strength++;
    }
    return strength;
}

function renderStrengthBar(password) {
    let strength = passwordStrengthCheck(password);
    let strengthBar = document.getElementById("strengthIndicator");
    let strengthPercentage = strength * 14.5;
    strengthBar.innerHTML = "";
    strengthBar.style.width = `${strengthPercentage}%`;
    if(strengthPercentage >= 80){
        strengthBar.style.backgroundColor = "var(--primary)";
    } else if(strengthPercentage >= 60){
        strengthBar.style.backgroundColor = "var(--primary-dark)";
    } else if(strengthPercentage >= 40){
        strengthBar.style.backgroundColor = "var(--yellow)";
    } else if(strengthPercentage >= 20){
        strengthBar.style.backgroundColor = "var(--danger)";
    }
}

function copyPassword() {
    let copyText = document.getElementById("passwordOutputText");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    document.getElementById("copyButtonText").style.opacity = "1";
    setTimeout(() => {
        document.getElementById("copyButtonText").style.opacity = "0";
    }, 1000);
}

loadDefaultValues();
