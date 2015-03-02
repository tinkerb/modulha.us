var http = require('http')
var body = require('body/form')
var router = require('router')
var stat = require('ecstatic')(__dirname + '/public')
var createdb = require('./lib/db')

//var level = require('level')
var db = createdb('messages')

//level('./data', {valueEncoding: 'json'})
var through = require('through2')
var bind = require('tcp-bind')
var arg = require('minimist')(process.argv)

//bind(arg.p)
//process.setgid(arg.g)
//process.setuid(arg.u)


var server = http.createServer(function(req, res){
  if(req.method == 'POST' && req.url == '/contact'){
    body(req, res, function(err, body){
      if(err) console.log(err)
      else{
        var now = new Date().toISOString()
        db.put(
          'messages!' + now,
           JSON.stringify(body.contact)
        )
        res.end('Thank you for contacting us.  Your message read:\n\n' + body.contact)
      }
    })    
  }
  else if(req.url == '/messages'){
    if(req.method == 'POST'){
      body(req, res, function(err, body){
        if (body.pass == arg.pass){
          var r = db.createReadStream({
            gt: 'messages!',
            lt: 'messages!~'
          })
          r.pipe(through.obj(
            function(row, enc, next){
              this.push(JSON.parse(row.value) + '\n')
              next()
            }
          )).pipe(res)
        }
        else res.writeHead(304, {'Location':'/messages'})
      })
    }
    else stat(req, res)
  }
  else stat(req, res)
})

server.listen(11005)
