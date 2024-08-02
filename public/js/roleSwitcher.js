document.addEventListener('DOMContentLoaded', () => {
  const updateButtons = document.querySelectorAll('button[type="submit"]');
  updateButtons.forEach((button) => {
      button.addEventListener('click', async (e) => {
          e.preventDefault();

          const select = button.previousElementSibling;
          const userId = select.dataset.userId;
          const newRole = select.value;

          sessionStorage.setItem('roleChangeSignal', 'true');
          
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

  const deleteButtons = document.querySelectorAll('button.btn-danger');
  deleteButtons.forEach((button) => {
      button.addEventListener('click', async (e) => {
          const userId = button.getAttribute('data-user-id');

          const result = await Swal.fire({
              title: 'Are you sure?',
              text: 'This action cannot be undone!',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!',
              cancelButtonText: 'No, cancel!'
          });
        
          if (result.isConfirmed) {
              try {
                  const response = await fetch(`/switcher/${userId}`, {
                      method: 'DELETE',
                  });

                  if (response.ok) {
                      Swal.fire({
                          title: 'User deleted successfully',
                          icon: 'success',
                      }).then(() => {
                          location.reload();
                      });
                  } else {
                      const result = await response.json();
                      Swal.fire({
                          title: 'Error deleting user',
                          text: result.message || 'Failed to delete the user. Please try again.',
                          icon: 'error',
                      });
                  }
              } catch (error) {
                  console.error(error);
                  Swal.fire({
                      title: 'Error',
                      text: 'An error occurred while deleting the user. Please try again.',
                      icon: 'error',
                  });
              }
          }
      });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const hasSignal = sessionStorage.getItem('roleChangeSignal');

  if (hasSignal) {
      sessionStorage.removeItem('roleChangeSignal');
      location.reload();
  }
});