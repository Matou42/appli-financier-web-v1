// frontend/scripts/notification.js

document.addEventListener('DOMContentLoaded', () => {
    const notificationContainer = document.getElementById('notification');
  
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
  
    window.showNotification = showNotification;
  
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
  
    async function handleFormSubmit(event, url) {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
  
      try {
        const response = await fetch(url, {
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
  
    if (signupForm) {
      signupForm.addEventListener('submit', (event) => handleFormSubmit(event, 'http://localhost:3000/api/auth/signup'));
    }
  
    if (loginForm) {
      loginForm.addEventListener('submit', (event) => handleFormSubmit(event, 'http://localhost:3000/api/auth/login'));
    }
  });  