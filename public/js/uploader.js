const form = document.getElementById('uploadForm');
const myUser = document.getElementById('userId');
const userId = myUser.getAttribute('data-user-id');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const files = document.getElementById('docs').files;

    if (files.length === 0) {
        await Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'No documents were uploaded.',
        });
        return;
    }
  
    try {
      const response = await fetch(`/api/users/${userId}/documents`, {
        method: 'POST',
        body: formData
      });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.message || 'Failed to upload documents.');
        }

        await Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Documents uploaded successfully. User upgraded to premium. Log out and Log in again to apply changes',
        });

        form.reset();

    } catch (error) {
        console.error('Error uploading documents:', error.message);

        await Swal.fire({
            icon: 'error',
            title: 'Error!',
            html: 'Failed to upload documents.<br>' + 
            'Error: Only PNG and JPEG are allowed for profileImage and productImage. Only PDF and text files are allowed for documents.',
        });
    }
});