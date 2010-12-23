var fs   = require("fs")
  , path = require("path")
  
var Jaspin = (function() {
  var $ = function(){
    var self = this  
    
    this.loadConfig(function() { self.config.folders = self.config.folders || [] })
  }
  
  $.CONFIG_PATH = __dirname + '/../../jaspin.conf'
  
  $.prototype.loadConfig = function(callback) {
    this.config = {}

    var self = this
    path.exists($.CONFIG_PATH, function(exists) {
      if(exists) {
        try {
          var config = fs.readFileSync($.CONFIG_PATH)
          self.config = JSON.parse(config)
        } catch (e) {} 
      }
      callback && callback(self.config)
    })
  }
  
  $.prototype.storeConfig = function(callback) {
    fs.writeFile($.CONFIG_PATH, JSON.stringify(this.config), function(err) {
      if(err) throw err
      callback && callback()
    })
  }
  
  $.prototype.watchFolder = function(folder, callback) {
    var self = this
    
    path.exists(folder, function(exists) {
      if(exists) {
        self.config.folders.push(folder)
        self.watchFilesInFolder(folder, callback)
      } else {
        console.log('No such folder to watch: ' + folder)
        callback && callback()
      }
    })
  }
  
  $.prototype.watchFilesInFolder = function(folder, callback) {
    var self = this
    
    fs.readdir(folder, function(err, files) {
      if(err) throw err
      
      files.forEach(function(file) {
        var filePath = [folder, file].join("/")
        
        fs.stat(filePath, function(err, stats) {
          if(err) {
            console.log(err)
          } else {
            if(stats.isDirectory())
              self.watchFilesInFolder(filePath)
            else
              self.watchFile(filePath)
          }
        })
      })
      
      callback && callback()
    })
  }
  
  $.prototype.watchFile = function(file) {
    console.log(file)
    fs.watchFile(file, function(curr, prev) {
      console.log('the current mtime is: ' + curr.mtime)
      console.log('the previous mtime was: ' + prev.mtime)
    })
  }
  
  return $
})()

module.exports.Jaspin = Jaspin