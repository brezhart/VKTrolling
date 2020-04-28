function gRI(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let https = require('https');
let fs = require('fs');
let tocken = fs.readFileSync('./tocken.txt').toString();
let target = fs.readFileSync('./target.txt').toString();
let text = fs.readFileSync('./text.txt').toString();


let checkURL = `https://api.vk.com/method/users.get?access_token=${tocken}&user_ids=${target}&fields=online&v=5.103`;
let msgUrl = `https://api.vk.com/method/messages.send?access_token=${tocken}&user_id=${target}&message=${encodeURIComponent(text)}&v=5.103&random_id=`;
let isOnline = 0;
let was = false;
function checkOnline(){
    https.get(checkURL,(res) => {
        res.on('data', (d) => {
            isOnline = JSON.parse(d.toString()).response[0].online;
            if (!isOnline && !was) {
                console.log("No online");
                setTimeout(checkOnline,3000);
            } else {
                console.log("Got him!!!!!!!!!!");
                was = true;
                https.get(msgUrl + gRI(1,99999999999),(resp)=>{});

            }
        });
    });
}
checkOnline();
