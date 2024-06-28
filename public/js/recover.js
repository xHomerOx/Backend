form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.querySelector('input[name="email"]').value;

  try {
    const response = await fetch('/products/recover', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (result.error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.error,
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: result.success,
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An unexpected error occurred',
    });
  }
});