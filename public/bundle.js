(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var readyGo = require('domready')
var jtype = require('jtype')
var viz = false

setTimeout(function(){
  if(!viz) document.body.style.visibility = 'visible';
},1.333)

readyGo(function(){

  document.body.style.visibility = 'visible';
  viz = true
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
})

},{"domready":2,"jtype":3}],2:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? fn() : fns.push(fn)
  }

});

},{}],3:[function(require,module,exports){
var p = document.createElement('pre');
p.style.visibility = 'hidden';
p.style.zIndex = -10;
p.style.position = 'absolute';
p.style.left = '-3000px';
p.style.margin = '0';
p.style.padding = '0';
//p.style.whiteSpace = 'nowrap';
p.textContent = '';

document.body.appendChild(p)
var alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
var punc = ',./;"\'<>?:"{}|!@#$%^&*()-=_+ '

module.exports = function(string, params){
  if(!('string' == typeof string)) {
    params = string || {}
    var a = typify(alpha, params);
    var p = typify(punc, params)
    var dict = {};
    dict.average = {alphabet: a.average, punctuation: p.average}
    for(var x in a) dict[x] = a[x]
    for(var y in p) dict[y] = p[y]
    dict.alphabet = a;
    dict.punctuation = p;
    return dict
  }
  else{
    return typify(string, params)
  }
}

function typify(string, params){

  for(var x in params){
    p.style[x] = params[x]
  }  

  var dict = {}
  var a = string.split('');
  var alphabet = a.map(styleMap)
  var sumWidth= alphabet.reduce(function(p,e,i,d){
    return p + e[0]
  }, 0)
  var sumHeight = alphabet.reduce(function(p,e){
    return p + e[1]
  },0)
 
  a.forEach(function(e,i){
    dict[e] = alphabet[i]
  })
  dict.sum = {width: sumWidth, height: sumHeight}
  dict.max = {}
  dict.max.height = alphabet.reduce(function(p,e){
    return e[1] > p ? e[1] : p
  },0)
  dict.average = {height: sumHeight / alphabet.length, width: sumWidth / alphabet.length}
  dict.total = styleMap(string);

  return dict

  function styleMap(e,i){
    var o = {}
    p.textContent = e;
    var w = parseFloat(getCSS(p, 'width'))
    var h = parseFloat(getCSS(p, 'height'))
    return [w, h]
  }

  return dict

}

function getCSS(el, prop){
  return document.defaultView.getComputedStyle(el).getPropertyValue(prop);
}

},{}]},{},[1]);
