/* global TrelloPowerUp */

var Promise = TrelloPowerUp.Promise;

var WHITE_ICON = './images/icon-white.svg';
var GRAY_ICON = './images/icon-gray.svg';
var LOCK_ICON = './images/lock.svg';

var parkMap = {
};

var getBadges = function(t){
  return t.card('name')
  .get('name')
  .then(function(cardName){
    var badgeColor;
    var icon = GRAY_ICON;
    var lowercaseName = cardName.toLowerCase();
    if(lowercaseName.indexOf('green') > -1){
      badgeColor = 'green';
      icon = WHITE_ICON;
    } else if(lowercaseName.indexOf('yellow') > -1){
      badgeColor = 'yellow';
      icon = WHITE_ICON;
    } else if(lowercaseName.indexOf('red') > -1){
      badgeColor = 'red';
      icon = WHITE_ICON;
    }

    if(lowercaseName.indexOf('dynamic') > -1){
      // dynamic badges can have their function rerun after a set number
      // of seconds defined by refresh. Minimum of 10 seconds.
      return [{
        dynamic: function(){
          return {
            title: 'Detail Badge', // for detail badges only
            text: 'Dynamic ' + (Math.random() * 100).toFixed(0).toString(),
            icon: icon, // for card front badges only
            color: badgeColor,
            refresh: 10
          }
        }
      }]
    }

    if(lowercaseName.indexOf('static') > -1){
      // return an array of badge objects
      return [{
        title: 'Detail Badge', // for detail badges only
        text: 'Static',
        icon: icon, // for card front badges only
        color: badgeColor
      }];
    } else {
      return [];
    }
  })
};

var formatNPSUrl = function(t, url){
  if(!/^https?:\/\/www\.nps\.gov\/[a-z]{4}\//.test(url)){
    return null;
  }
  var parkShort = /^https?:\/\/www\.nps\.gov\/([a-z]{4})\//.exec(url)[1];
  if(parkShort && parkMap[parkShort]){
    return parkMap[parkShort];
  } else{
    return null;
  }
};

var boardButtonCallback = function(t) {
  return t.popup({
    title: 'Blueprint Integration',
    items: [
        {
            text: 'Login',
            callback: function(t){
                return Promise.all([
                    t.get('organization', 'shared', 'server')
                ]).spread(function(server) {
                    t.overlay({
                        url: './login.html',
                        args: { server: server }
                    })
                })
                    .then(function() {
                        return t.closePopup();
                    });
            }
        },
        {
            text: 'Select a project',
            callback: function(t){
                return Promise.all([
                    t.get('organization', 'shared', 'server'),
                    t.get('organization', 'private', 'blueprint_token'),
                    t.board('id', 'name', 'url', 'shortLink')
                ]).spread(function(server, token, board) {
                    t.overlay({
                        url: './picker.html',
                        args: {
                            server: server,
                            token: token,
                            board: board
                        }
                    })
                })
                    .then(function() {
                        return t.closePopup();
                    });
            }
        },
        {
            text: 'Help',
            callback: function(t){
                return t.boardBar({
                    url: './board-bar.html',
                    height: 200
                })
                    .then(function(){
                        return t.closePopup();
                    });
            }
        }
    ]
  });
};

var cardButtonCallback = function(t){
  var items = Object.keys(parkMap).map(function(parkCode){
    var urlForCode = 'http://www.nps.gov/' + parkCode + '/';
    return {
      text: parkMap[parkCode],
      url: urlForCode,
      callback: function(t){
        return t.attach({ url: urlForCode, name: parkMap[parkCode] })
        .then(function(){
          return t.closePopup();
        })
      }
    };
  });

  return t.popup({
    title: 'Popup Search Example',
    items: items,
    search: {
      count: 5,
      placeholder: 'Search National Parks',
      empty: 'No parks found'
    }
  });
};

TrelloPowerUp.initialize({
  'board-buttons': function(t, options){
    return [{
      icon: LOCK_ICON,
      text: 'Blueprint Integration',
      callback: boardButtonCallback
    }];
  },
  'card-from-url': function(t, options) {
    var parkName = formatNPSUrl(t, options.url);
    if(parkName){
      return {
        name: parkName,
        desc: 'An awesome park: ' + options.url
      };
    } else {
      throw t.NotHandled();
    }
  },
  'show-settings': function(t, options){
    return t.popup({
      title: 'Settings',
      url: './settings.html',
      height: 184
    });
  }
});
