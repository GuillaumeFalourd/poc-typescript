import axios from 'axios';

let version;
try {
    axios.get('https://v3.ritchiecli.io/stable.txt').then(function (response) {
        version = response.data;
        console.log("Stable version: " + version);
    });
} catch (err) {
    console.log("Error:" + err);
}