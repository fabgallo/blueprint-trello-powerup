/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;
var t = TrelloPowerUp.iframe();

var blueprintServer = document.getElementById('server');

t.render(function(){
  return Promise.all([
    t.get('board', 'shared', 'server')
  ])
  .spread(function(savedServer) {
    if(savedServer && /^https?\/\/([a-z0-9-]+\.)?[a-z0-9-]+\.[a-z]{2,6}(\/)?/.test(savedServer)) {
        blueprintServer.value = savedServer;
    }
  })
  .then(function(){
    t.sizeTo('#content')
    .done();
  })
});

document.getElementById('save').addEventListener('click', function() {
    return t.set('board', 'shared', 'server', blueprintServer.value)
        .then(function() {
            t.closePopup();
        })
});
