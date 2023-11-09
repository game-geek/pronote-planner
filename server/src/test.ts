var http = require('http');
var server = http.createServer(function(req: any, res: any){
    res.send
    // res.setHeader('Content-Length', 100);
    // res.writeHead(200);
    // res.write('1234567890');
    // setTimeout(function() { res.connection.destroy(); }, 500);
});
server.listen(8080);
console.log("e")