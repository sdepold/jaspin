var jaspin = new (require(__dirname + "/lib/jaspin/jaspin").Jaspin)

jaspin.watchFolder(__dirname, function(){
  console.log("jo")
})