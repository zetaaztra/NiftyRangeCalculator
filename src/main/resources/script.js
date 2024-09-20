function calculateRange() {
    const niftySpotPrice = parseFloat(document.getElementById('niftySpotPrice').value);
    const impliedVolatility = parseFloat(document.getElementById('impliedVolatility').value) / 100;
    const daysTillExpiry = parseFloat(document.getElementById('daysTillExpiry').value) / 365;

    const sqrtDaysTillExpiry = Math.sqrt(daysTillExpiry);
    const range = niftySpotPrice * impliedVolatility * sqrtDaysTillExpiry;

    const minValue = niftySpotPrice - range;
    const maxValue = niftySpotPrice + range;

    document.getElementById('result').innerText = 'Range +/-: ' + range.toFixed(2);
    document.getElementById('rangeResult').innerText = 'Nifty Range: ' + minValue.toFixed(2) + ' - ' + maxValue.toFixed(2);
}
