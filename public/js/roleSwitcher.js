document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('role-switch-form');

  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const selectElements = form.querySelectorAll('select[name="role"]');
      
      for (let select of selectElements) {
          const userId = select.dataset.userId;
          const newRole = select.value;
          
          try {
              const response = await fetch(`/switcher/${userId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ role: newRole }),
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
      }
  });
});