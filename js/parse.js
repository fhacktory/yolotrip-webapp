// Initialisation de la connexion avec bower
Parse.initialize("nv6txND3tt0ZovoGcLIz2Tv5HA3DADWEICf7zVfu", "qfPy6bjlKBlwmLNgyRxyeBkpiQIu5ntmqx5DlAkY");

// User
function user_create(username, email, password) {
  var user = new Parse.User();
  user.set("username", username);
  user.set("password", password);
  user.set("email", email);

  // other fields can be set just like with Parse.Object
  user.set("phone", "650-555-0000");

  user.signUp(null, {
    success: function(user) {
      // Hooray! Let them use the app now.
    },
    error: function(user, error) {
      // Show the error message somewhere and let the user try again.
      alert("Error: " + error.code + " " + error.message);
    }
  });
}
