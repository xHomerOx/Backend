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
          const result = await response.json();
          if (result.message === 'Role is already set to the selected role') {
            Swal.fire({
              title: 'No changes made',
              text: 'The selected role is already applied to this user. No updates were made.',
              icon: 'info',
            });
          } else {
            Swal.fire({
              title: 'Role updated successfully',
              icon: 'success',
            });
          }
        } else {
          const result = await response.json();
          Swal.fire({
            title: 'Error updating role',
            text: result.message || 'Failed to update the role. Please try again.',
            icon: 'error',
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while updating the role. Please try again.',
          icon: 'error',
        });
      }
    });
  });
});
