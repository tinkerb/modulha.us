var input = document.querySelector('textarea')
var chars = document.getElementById('chars')

input.addEventListener('paste', typo) 

input.addEventListener('keydown', typo)

function typo (e){
var self = this
setTimeout(function(){
  var ct = self.value.length
  if(ct > 220 && e.keyCode !== 8) {
    e.preventDefault()
    self.value = self.value.slice(0,220)
  }
  chars.textContent = self.value.length 
},0)
}
