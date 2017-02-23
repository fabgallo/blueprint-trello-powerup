/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

var server = t.arg('server');
if(server.substr(server.length - 1, 1) !== "/") {
    server += "/";
}
var token = t.arg('token');

var picker = document.getElementById('picker');
var select = document.getElementById('select');

var errmsg = document.getElementById('errmsg');
if (typeof token !== "string" || token == "") {
    picker.style.display = "none";
    select.style.display = "none";
    errmsg.style.display = "block";
    errmsg.textContent = "Please login before trying to select a project"
}

document.getElementById('select').addEventListener('click', function() {
});

t.render(function(){
  // this function we be called once on initial load
  // and then called each time something changes that
  // you might want to react to, such as new data being
  // stored with t.set()
    $.ajax
    ({
        type: "GET",
        url: server + "api/v1/projects?api_key=" + token,
        dataType: 'json',
        async: false,
        //data: '{}',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', "BlueprintToken " + token);
        },
        success: function (data) {
            console.log(data);

            t.closeOverlay().done();
        },
        error: function () {
            alert("Failed to retrieve projects");
        }
    });
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
