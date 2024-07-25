// frontend/scripts/resetPassword.js

document.addEventListener('DOMContentLoaded', () => {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
  
    function showNotification(message, isError = false) {
      const options = {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-right',
        timeOut: '3000',
      };
      if (isError) {
        toastr.error(message, 'Erreur', options);
      } else {
        toastr.success(message, 'Succès', options);
      }
    }
  
    async function handleFormSubmit(event) {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
  
      try {
        const response = await fetch('http://localhost:3000/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        const result = await response.json();
        console.log('Response:', result);
  
        if (response.ok) {
          showNotification(result.message);
        } else {
          showNotification(result.error || 'Erreur lors de la requête', true);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showNotification('Erreur de connexion au serveur', true);
      }
    }
  
    if (resetPasswordForm) {
      resetPasswordForm.addEventListener('submit', handleFormSubmit);
    }
  });
  