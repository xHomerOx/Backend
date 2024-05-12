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
                throw new Error('User already exists');
            }

            const registerMessage = document.createElement('p');

            registerMessage.textContent = 'User Registered';
            registerForm.appendChild(registerMessage);

            console.log('User Registered');
            
            registerForm.reset();
        } catch (error) {
            const registerMessage = document.createElement('p');

            registerMessage.textContent = error.message;
            registerForm.appendChild(registerMessage);
            
            console.error(error.message);
        }
    });
});