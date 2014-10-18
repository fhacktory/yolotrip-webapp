var User = Parse.Object.extend("User");
var query = new Parse.Query(User);
query.equalTo("username", "Chupee");
query.find({
  success: function(results) {
    console.log("Successfully retrieved " + results.length + " scores.");
    // Do something with the returned Parse.Object values
    for (var i = 0; i < results.length; i++) { 
      var object = results[i];
      alert(object.id + ' - ' + object.get('username'));
    }
  },
  error: function(error) {
    console.log("Error: " + error.code + " " + error.message);
  }
});