$(document).ready(function () {
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    const email = $('#email').val().trim();
    const password_hash = $('#password').val();
    const remember = $('#remember').is(':checked');

    // Basic client-side validation
    if (!email || !password) {
      alert('Please fill in both email and password.');
      return;
    }

    // Your API endpoint
    const apiUrl = `${CONFIG.API_BASE_URL}/api/Auth/login`;

    $.ajax({
      url: apiUrl,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ email, password_hash }),
      success: function (response) {
        // If your API returns a token:
        if (response.data.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('role', response.role_name);
        }
        // Redirect to dashboard.html
        var redirect_url = localStorage.getItem('redirect_url');
        debugger
        if(redirect_url != '' && redirect_url != null){
          window.location.href = redirect_url;
        } else if (response.data.role_name == 'admin') {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/home';
        }
      },
      error: function (jqXHR) {
        // Show error message
        let msg = 'Login failed';
        if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
          msg = jqXHR.responseJSON.message;
        }
        alert(msg);
      }
    });
  });
});
