/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

var server = t.arg('server');
if(server.substr(server.length - 1, 1) !== "/") {
    server += "/";
}

var key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function utf8Encode(input) {
    input = input.replace(/\r\n/g, "\n");
    var output = "";

    for (var n = 0; n < input.length; n++) {

        var c = input.charCodeAt(n);

        if (c < 128) {
            output += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
            output += String.fromCharCode((c >> 6) | 192);
            output += String.fromCharCode((c & 63) | 128);
        } else {
            output += String.fromCharCode((c >> 12) | 224);
            output += String.fromCharCode(((c >> 6) & 63) | 128);
            output += String.fromCharCode((c & 63) | 128);
        }
    }

    return output;
}

function encode(input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = utf8Encode(input);

    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
            key.charAt(enc1) + key.charAt(enc2) +
            key.charAt(enc3) + key.charAt(enc4);
    }

    return output;
}

function make_base_auth(user, password) {
    var tok = user + ':' + password;
    var hash = btoa(tok);
    return "Basic " + hash;
}

document.getElementById('login').addEventListener('click', function() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    //password = encode(password);

    $.ajax
    ({
        type: "GET",
        url: server + "authentication/v1/loginEx",
        dataType: 'json',
        async: false,
        data: '{}',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', make_base_auth(username, password));
        },
        success: function (data) {
            console.log(data);
        }
    });
});

t.render(function(){
  // this function we be called once on initial load
  // and then called each time something changes that
  // you might want to react to, such as new data being
  // stored with t.set()
    document.getElementById('server').textContent = server;
});

// close overlay if user clicks outside our content
document.addEventListener('click', function(e) {
  if(e.target.tagName == 'BODY') {
    t.closeOverlay().done();
  }
});

// close overlay if user presses escape key
document.addEventListener('keyup', function(e) {
  if(e.keyCode == 27) {
    t.closeOverlay().done();
  }
});
