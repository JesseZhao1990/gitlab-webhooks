
/* eslint-disable */

var http = require('http')
var createHandler = require('gitlab-webhook-handler')
var config = require('./config.js')
var handler = createHandler({ path: `${config.location}`})

//listen
http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(config.service_port)


console.log(`Gitlab Hook Server running at http://0.0.0.0:${config.service_port}${config.location}`);

//push handle
function run_cmd(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  child.stdout.on('data', function(buffer) { console.log(buffer.toString()); });
  child.stdout.on('end', function() { callback () });
}

handler.on('error', function (err) {
    console.error('Error:', err.message)
})

//push event
handler.on('push', function (event) {
    console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref)
    run_cmd('sh', [config.event.push], function(){ console.log('shell脚本执行完毕') });
})

//merge event
handler.on('merge', function (event) {
  console.log('Received a merge event for %s to %s',
  event.payload.repository.name,
  event.payload.ref)
  run_cmd('sh', [config.event.push], function(){ console.log('shell脚本执行完毕') });
})

handler.on('issues', function (event) {
    console.log('Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})