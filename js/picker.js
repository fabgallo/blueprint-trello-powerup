/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

var server = t.arg('server');
if(server && server.substr(server.length - 1, 1) !== "/") {
    server += "/";
}
var token = t.arg('token');
var board = t.arg('board');

t.board('id', 'name', 'url').then(function(promiseResult){console.log(promiseResult)});

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

    t.closeOverlay().done();
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
        async: true,
        //data: '{}',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', "BlueprintToken " + token);
        },
        success: function (data) {
            if (data.length) {
                for (var i in data) {
                    var option = document.createElement("option");
                    option.text = data[i].Name;
                    option.value = data[i].Id;
                    picker.add(option);
                }
            }
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
