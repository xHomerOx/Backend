document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('form');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(registerForm);
        const userData = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            email: formData.get('email'),
            age: formData.get('age'),
            password: formData.get('password')
        };

        try {
            const response = await fetch('/products/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Error adding User');
            }

            const data = await response.json();
            console.log('User Registered:', data);

        } catch (error) {
            console.error(error.message);
        }
    });
});