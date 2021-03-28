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


let msgUrl = `https://api.vk.com/method/messages.send?access_token=${tocken}&user_id=${target}&message=${encodeURIComponent(text)}&v=5.103&random_id=`;
let checkURL = `https://api.vk.com/method/messages.getConversationsById?access_token=${tocken}&peer_ids=${target}&fields=unread_count+out_read&v=5.103&random_id=`;

let isOnline = 0;
let was = false;

let id = 0;
https.get(msgUrl + gRI(1,99999999999),(res)=>{
    res.on('data', (d) => {
        id =  JSON.parse(d.toString()).response;
        check();
    });
});

function check(){
    https.get(checkURL + gRI(1,99999999999),(res)=>{
        res.on('data', (d) => {
            console.log(id);
            let data =  JSON.parse(d.toString()).response.items[0];
            if (data.in_read === data.out_read) {
                // прочитал
                setTimeout(function(){
                    https.get(`https://api.vk.com/method/messages.delete?access_token=${tocken}&message_ids=${id}&delete_for_all=1&v=5.103&random_id=` + gRI(1, 99999999999), (res) => {});
                    // process.exit(1);
                    }, 1);
            } else {
                setTimeout(check, 400);
            }
        });
    });
}

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
// checkOnline();
