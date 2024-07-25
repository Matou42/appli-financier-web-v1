const signUpButton = document.getElementById('signUp');
const signInButtom = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

signInButtom.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});  

$(document).ready(function() {
  $('#loginForm').submit(function(event) {
    event.preventDefault();

    var formData = {
      email: $('input[name=email]').val(),
      password: $('input[name=password]').val()
    };

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      data: formData,
      success: function(response, status, xhr) {
        // Vérifiez le statut HTTP
        if (xhr.status === 200) {
          // Redirection vers le tableau de bord après connexion réussie
          window.location.href = '../dashboard.html';
        } else {
          console.error('Réponse serveur avec un statut non géré :', xhr.status);
          toastr.error('Erreur lors de la connexion. Veuillez réessayer.');
        }
      },
      error: function(xhr) {
        console.error('Erreur lors de l\'authentification :', xhr.responseText);
        toastr.error('Erreur lors de la connexion. Veuillez réessayer.');
      }
    });
  });
});
