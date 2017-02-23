/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

var server = t.arg('server');
if(server.substr(server.length - 1, 1) !== "/") {
    server += "/";
}
var token = t.arg('token');

var picker = document.getElementById('picker');
var errmsg = document.getElementById('errmsg');
if (typeof token !== "string" || token == "") {
    picker.style.display = "none";
    errmsg.style.display = "block";
    err.textContent = "Please login before trying to select a project"
}

document.getElementById('select').addEventListener('click', function() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    //password = encode(password);

    $.ajax
    ({
        type: "GET",
        url: server + "authentication/v1/loginEx",
        dataType: 'json',
        async: false,
        xhrFields: {
            withCredentials: true
        },
        username: username,
        password: password,
        //data: '{}',
        // beforeSend: function (xhr) {
        //     xhr.setRequestHeader('Authorization', make_base_auth(username, password));
        // },
        success: function (data) {
            t.set('board', 'private', 'blueprint_token', data.Token);
            t.set('board', 'private', 'blueprint_token_expiration', data.TokenExpirationTime);
            t.set('board', 'private', 'blueprint_user_id', data.UserId);
            t.set('board', 'private', 'blueprint_user_license', data.UserLicense);
            t.set('board', 'private', 'blueprint_user_username', data.UserName);
            t.set('board', 'private', 'blueprint_user_displayname', data.UserDisplayName);
            alert("Welcome, " + data.UserDisplayName + "!");

            t.closeOverlay().done();
        },
        fail: function () {
            alert("login failed");
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
