/* register.js – handles the registration form via jQuery + AJAX */

$(document).ready(function () {
    $('select').niceSelect();
  });

$(function () {
  $('#register-form').on('submit', function (e) {
    e.preventDefault();

    // Gather values
    const name       = $('#name').val().trim();
    const email      = $('#email').val().trim();
    const phone      = $('#phone').val().trim();
    const password   = $('#password').val();
    const confirmPwd = $('#confirm-password').val();
    const role = $('#role').val();

    if (password !== confirmPwd) {
      alert('Passwords do not match.');
      return;
    }

    // Build request body (matches your sample)
    const payload = {
      id: 0,
      role_id: role,
      name,
      email,
      password_hash: password,   // plain password unless your backend hashes
      phone,
      token: "",
      status: 0,
      created_at: new Date().toISOString()
    };
    const apiUrl = `${CONFIG.API_BASE_URL}/api/Auth/register`;
    $.ajax({
      url: apiUrl,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(payload),

      success(res) {
        console.log('Register success:', res);
        alert('Account created! Redirecting to login...');
        window.location.href = '/login';
      },

      error(xhr, _status, err) {
        const msg = xhr.responseText || err || 'Unknown error';
        console.error(msg);
        alert('Registration failed: ' + msg);
      }
    });
  });
});
