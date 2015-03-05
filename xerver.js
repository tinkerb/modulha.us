var http = require('http')
var body = require('body/form')
var router = require('router')
var stat = require('ecstatic')(__dirname + '/public')
var through = require('through2')
var bind = require('tcp-bind')
var arg = require('minimist')(process.argv)
var url = require('url')

var createdb = require('./lib/db')
var db = createdb('messages')
var site = arg.h

var fd = bind(arg.p)
process.setgid(arg.g)
process.setuid(arg.u)


var server = http.createServer(function(req, res, bounce){
  var host = req.headers.host
  if(/^www/.test(host)){
    res.writeHead(302, {'Location' : 'http://'+host.replace(/^www\./, '')})
    res.end()
    return
  }
  else if(req.method == 'POST' && req.url == '/contact'){
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
          res.writeHead(200, {'Content-type' : 'text/html'})
          var r = db.createReadStream({
            gt: 'messages!',
            lt: 'messages!~'
          })
          r.pipe(through.obj(
            function(row, enc, next){
              this.push(JSON.parse(row.value) + '\r\n')
              next()
            }
          )).pipe(res)
        }
        else res.writeHead(307, {'Location':'/messages'})
      })
    }
    else stat(req, res)
  }
  else stat(req, res)
})

server.listen({fd:fd})
