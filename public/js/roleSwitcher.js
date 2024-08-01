document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('button[type="submit"]');

  buttons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const select = button.previousElementSibling;
      const userId = select.dataset.userId;
      const newRole = select.value;

      try {
        const response = await fetch(`/switcher/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole }),
        });

        if (response.redirected) {
          window.location.href = response.url;
        } else if (response.ok) {
          Swal.fire({
            title: 'Role updated successfully',
            icon: 'success',
          });
        } else {
          Swal.fire({
            title: 'Error updating role',
            text: 'Please try again',
            icon: 'error',
          });
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
});