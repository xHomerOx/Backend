document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const userData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                throw new Error('Wrong Password');
            }

            const loginMessage = document.createElement('p');

            loginMessage.textContent = 'Logged in success';
            loginForm.appendChild(loginMessage);

            console.log('Logged in success');
            
            loginForm.reset();

            window.location.href = '/products/realtimeproducts';
        } catch (error) {
            const loginMessage = document.createElement('p');

            loginMessage.textContent = error.message;
            loginForm.appendChild(loginMessage);
            
            console.error(error.message);
        }
    });
});