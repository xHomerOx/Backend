const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.querySelector('input[name="email"]').value;

  try {
    const response = await fetch('/recover', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: result.success,
      });
    } else {
      if (result.error === 'Token has expired. Please request a new password recovery link.') {
        window.location.href = '/recover';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.error,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Wrong Email'
        });
      }
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An unexpected error occurred'
    });
  }
});