// Conversion data and formulas for each category (same as before)
const conversionData = {
    length: { units: { meters: 1, kilometers: 0.001, miles: 0.000621371, feet: 3.28084 } },
    weight: { units: { grams: 1, kilograms: 0.001, pounds: 0.00220462, ounces: 0.035274 } },
    temperature: {
        units: { celsius: 'C', fahrenheit: 'F', kelvin: 'K' },
        formula: (value, from, to) => {
            if (from === to) return value;
            if (from === 'celsius' && to === 'fahrenheit') return value * 9 / 5 + 32;
            if (from === 'fahrenheit' && to === 'celsius') return (value - 32) * 5 / 9;
            if (from === 'celsius' && to === 'kelvin') return value + 273.15;
            if (from === 'kelvin' && to === 'celsius') return value - 273.15;
            if (from === 'fahrenheit' && to === 'kelvin') return (value - 32) * 5 / 9 + 273.15;
            if (from === 'kelvin' && to === 'fahrenheit') return (value - 273.15) * 9 / 5 + 32;
        }
    },
    volume: { units: { liters: 1, milliliters: 1000, gallons: 0.264172, cups: 4.22675 } },
    speed: { units: { 'm/s': 1, 'km/h': 3.6, 'mph': 2.23694, 'knots': 1.94384 } },
    area: { units: { 'sq_meters': 1, 'sq_kilometers': 0.000001, 'acres': 0.000247105, 'hectares': 0.0001 } },
    time: { units: { seconds: 1, minutes: 1/60, hours: 1/3600, days: 1/86400 } }
};

// Update units based on category selection
function updateUnits() {
    const category = document.getElementById('category').value;
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';

    const units = conversionData[category].units;
    for (const unit in units) {
        const option1 = document.createElement('option');
        option1.value = unit;
        option1.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
        fromUnit.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = unit;
        option2.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
        toUnit.appendChild(option2);
    }
}

// Conversion function with history tracking
function convert() {
    const inputValue = parseFloat(document.getElementById('inputValue').value);
    const category = document.getElementById('category').value;
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;

    if (isNaN(inputValue)) {
        document.getElementById('result').textContent = 'Please enter a valid number';
        return;
    }

    let convertedValue;
    if (category === 'temperature') {
        convertedValue = conversionData.temperature.formula(inputValue, fromUnit, toUnit);
    } else {
        const baseValue = inputValue / conversionData[category].units[fromUnit];
        convertedValue = baseValue * conversionData[category].units[toUnit];
    }

    document.getElementById('result').textContent = `Result: ${convertedValue.toFixed(4)} ${toUnit}`;
    addToHistory(inputValue, fromUnit, convertedValue.toFixed(4), toUnit);
}

// Change theme, font, and dark mode
function changeTheme() {
    const theme = document.getElementById('theme').value;
    document.body.className = `${theme}-theme ${document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode'}`;
}

function changeFontStyle() {
    const font = document.getElementById('font').value;
    document.body.style.fontFamily = font === 'default' ? 'Arial, sans-serif' : font;
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Track conversions in history
function addToHistory(value, from, result, to) {
    const historyList = document.getElementById('historyList');
    const historyItem = document.createElement('li');
    historyItem.textContent = `${value} ${from} = ${result} ${to}`;
    historyList.appendChild(historyItem);
}

// Clear and export history
function clearHistory() {
    document.getElementById('historyList').innerHTML = '';
}

function exportHistory() {
    const historyItems = [...document.getElementById('historyList').children].map(item => item.textContent).join('\n');
    const blob = new Blob([historyItems], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'conversion_history.txt';
    link.click();
}

// Initialize units on load
updateUnits();
