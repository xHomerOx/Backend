const form = document.getElementById('uploadForm');
const myUser = document.getElementById('userId');
const userId = myUser.getAttribute('data-user-id');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch(`/api/users/${userId}/documents`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.message || 'Failed to upload documents.');
        }

        await Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Documents uploaded successfully. User upgraded to premium.',
        });

        form.reset();

    } catch (error) {
        console.error('Error uploading documents:', error.message);

        await Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to upload documents. Please try again.',
        });
    }
});