const query = '[out:json][timeout:25];node["power"="plant"](-35.0,-75.0,5.0,-35.0);out 50;';
fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: `data=${encodeURIComponent(query)}`
})
.then(r => r.text())
.then(text => console.log('Response:', text))
.catch(e => console.error('Error:', e));
