const form = document.getElementById('role-switch-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selects = form.querySelectorAll('select[name^="role-"]');
    const updates = [];

    selects.forEach(select => {
        const userId = select.name.replace('role-', '');
        const newRole = select.value;
        updates.push({ userId, role: newRole });
    });

    try {
        const response = await fetch(`/switcher/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });

        if (response.ok) {
            Swal.fire({
                title: 'Roles updated successfully',
                icon: 'success',
            });
        } else {
            Swal.fire({
                title: 'Error updating roles',
                text: 'Please try again',
                icon: 'error',
            });
        }
    } catch (error) {
        console.error(error);
        Swal.fire({
            title: 'Error',
            text: 'An error occurred while updating roles',
            icon: 'error',
        });
    }
});
