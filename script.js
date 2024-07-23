document.addEventListener("DOMContentLoaded", function() {
    // Load saved data
    loadSavedData();

    // Set default pack date to today
    const today = new Date();
    document.getElementById('packDate').value = formatDate(today);

    // Set default values for expDays, grade, and license prefix if not already set
    if (!localStorage.getItem('labelData')) {
        document.getElementById('expDays').value = 45;
        document.getElementById('grade').value = "A";
        document.getElementById('licensePrefix').value = "IND-";
    }

    // Save data when form is submitted
    document.getElementById('labelForm').addEventListener('input', saveData);
});

function saveData() {
    const data = {
        farmName: document.getElementById('farmName').value,
        address: document.getElementById('address').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        licensePrefix: document.getElementById('licensePrefix').value,
        licenseNumber: document.getElementById('licenseNumber').value,
        grade: document.getElementById('grade').value,
        size: document.getElementById('size').value,
        packDate: document.getElementById('packDate').value,
        expDays: document.getElementById('expDays').value,
        threeDigitFormat: document.getElementById('threeDigitFormat').checked,
    };
    localStorage.setItem('labelData', JSON.stringify(data));
}

function loadSavedData() {
    const savedData = JSON.parse(localStorage.getItem('labelData'));
    if (savedData) {
        document.getElementById('farmName').value = savedData.farmName;
        document.getElementById('address').value = savedData.address;
        document.getElementById('phoneNumber').value = savedData.phoneNumber;
        document.getElementById('licensePrefix').value = savedData.licensePrefix;
        document.getElementById('licenseNumber').value = savedData.licenseNumber;
        document.getElementById('grade').value = savedData.grade;
        document.getElementById('size').value = savedData.size;
        document.getElementById('packDate').value = savedData.packDate;
        document.getElementById('expDays').value = savedData.expDays;
        document.getElementById('threeDigitFormat').checked = savedData.threeDigitFormat;
    } else {
        // Set default values if no saved data exists
        document.getElementById('expDays').value = 45;
        document.getElementById('grade').value = "A";
        document.getElementById('licensePrefix').value = "IND-";
    }
}

function generateLabels() {
    const farmName = document.getElementById('farmName').value;
    const address = document.getElementById('address').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const licensePrefix = document.getElementById('licensePrefix').value;
    const licenseNumber = document.getElementById('licenseNumber').value;
    const grade = document.getElementById('grade').value;
    const size = document.getElementById('size').value;
    const packDate = document.getElementById('packDate').value;
    const expDays = parseInt(document.getElementById('expDays').value);
    const threeDigitFormat = document.getElementById('threeDigitFormat').checked;

    const packDateObj = new Date(packDate);
    const expDateObj = new Date(packDateObj.getTime() + expDays * 24 * 60 * 60 * 1000);
    
    const expDateFormatted = formatDate(expDateObj);
    const expDate = `EXP ${expDateFormatted}`;

    const packDateFormatted = threeDigitFormat
        ? getDayOfYear(packDateObj)
        : `${packDateObj.toLocaleString('default', { month: 'short' })} ${packDateObj.getDate()}`;

    const labelHtml = `
        <div class="label">
            <p><strong>${farmName}</strong></p>
            <p>${address}</p>
            <p>Phone: ${phoneNumber}</p>
            <p>License: ${licensePrefix}${licenseNumber}</p>
            <p>Grade: ${grade}</p>
            <p>Size: ${size}</p>
            <p>Pack Date: ${packDateFormatted}</p>
            <p>${expDate}</p>
            <div class="safe-handling">
                <strong>SAFE HANDLING INSTRUCTIONS:</strong> 
                To prevent illness from bacteria: keep eggs refrigerated, cook eggs until yolks are firm, and cook foods containing eggs thoroughly.
            </div>
        </div>
    `;
    
    document.getElementById('labelPreview').innerHTML = labelHtml +labelHtml;
}

function printLabels() {
    const printContents = document.getElementById('labelPreview').innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;

    loadSavedData();
}

function formatDate(date) {
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
}

function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return `0${day}`.slice(-3);
}

function exportData() {
    const data = localStorage.getItem('labelData');
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'labelData.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importData() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const data = JSON.parse(event.target.result);
        localStorage.setItem('labelData', JSON.stringify(data));
        loadSavedData();
    };

    reader.readAsText(file);
}
