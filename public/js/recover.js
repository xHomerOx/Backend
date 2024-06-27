const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.querySelector('input[name="email"]').value;

  try {
    const response = await fetch('/products/recover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (result.success) {
      console.log(result.success);
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error(error);
  }
});