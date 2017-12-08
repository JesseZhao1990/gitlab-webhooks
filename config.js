module.exports={
  service_port:7777,
  location: '/webhook',
  
  event:{
    push:'./webhooks.sh',
    merge:'./webhooks.sh',
  }

}