const form = document.getElementById('role-switch-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const roleId = document.getElementById('role').value;
    try {
      const response = await fetch('/premium/{{uid}}/role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId }),
      });
      if (response.ok) {
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