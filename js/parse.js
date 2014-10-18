// Initialisation de la connexion avec bower
Parse.initialize("nv6txND3tt0ZovoGcLIz2Tv5HA3DADWEICf7zVfu", "qfPy6bjlKBlwmLNgyRxyeBkpiQIu5ntmqx5DlAkY");

// Test de la connexion
var TestObject = Parse.Object.extend("TestObject");
var testObject = new TestObject();
testObject.save({foo: "bar"}, {
  success: function(object) {
    $(".success").show();
  },
  error: function(model, error) {
    $(".error").show();
  }
});
