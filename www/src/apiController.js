class ApiController {
    constructor(url) {
        this.url = url;
    }

    postResult(nick, mode, points) {
        var xhr = new XMLHttpRequest();


        const a1gamer = this.url + '/user_data/?nick=' + nick + '&timestamp=' + Math.floor(Date.now() / 1000) + '&mode=' + mode.toString() + '&result=' + points.toString();


        xhr.open("POST", a1gamer, true);

        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.send(JSON.stringify({

            nick: ""

        }));

    }   

    getUserDataResponse(nick) {
        
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", this.url + '/user_data/' + nick, false); 
        xmlHttp.send( null );
        console.log(xmlHttp.responseText);
        return xmlHttp.responseText
    }
}

export { ApiController }