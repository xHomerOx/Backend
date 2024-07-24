const form = document.getElementById('uploadForm');
const myUser = document.getElementById('userId');
const userId = myUser.getAttribute('data-user-id');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const profileImage = document.getElementById('profileImage').files;
    const productImage = document.getElementById('productImage').files;
    const docs = document.querySelectorAll('.docs');
    let hasDocs = false;

    docs.forEach((doc) => {
        if (doc.files.length > 0) {
            hasDocs = true;
        }
    });

    if (profileImage.length === 0 || productImage.length === 0 || !hasDocs) {
        await Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Not all required files have been uploaded.',
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
            text: 'Documents uploaded successfully. User upgraded to premium. Log out and log in again to apply changes.',
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