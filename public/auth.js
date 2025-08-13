document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Check if user is already logged in
    checkSession();

    // Form switching
    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        clearMessages();
    });

    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        clearMessages();
    });

    // Login form submission
    document.getElementById('login').addEventListener('submit', async function(e) {
        e.preventDefault();
        clearMessages();

        const formData = new FormData(e.target);
        const loginData = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (response.ok) {
                showSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = '/game';
                }, 1500);
            } else {
                showError(result.error || 'Login failed');
            }
        } catch (error) {
            showError('Network error. Please try again.');
        }
    });

    // Registration form submission
    document.getElementById('register').addEventListener('submit', async function(e) {
        e.preventDefault();
        clearMessages();

        const formData = new FormData(e.target);
        const registerData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            phone: formData.get('phone'),
            birthDate: formData.get('birthDate')
        };

        // Client-side validation
        const validationErrors = validateRegistrationData(registerData);
        if (validationErrors.length > 0) {
            showError(validationErrors.join(' '));
            return;
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData)
            });

            const result = await response.json();

            if (response.ok) {
                showSuccess('Registration successful! You can now login.');
                document.getElementById('register').reset();
                setTimeout(() => {
                    registerForm.classList.add('hidden');
                    loginForm.classList.remove('hidden');
                }, 2000);
            } else {
                if (result.errors) {
                    const errorMessages = result.errors.map(err => err.msg).join(' ');
                    showError(errorMessages);
                } else {
                    showError(result.error || 'Registration failed');
                }
            }
        } catch (error) {
            showError('Network error. Please try again.');
        }
    });

    // Real-time validation for registration form
    document.getElementById('regPassword').addEventListener('input', function(e) {
        validatePasswordRealTime(e.target.value);
    });

    document.getElementById('regPhone').addEventListener('input', function(e) {
        validatePhoneRealTime(e.target.value);
    });

    document.getElementById('regBirthDate').addEventListener('change', function(e) {
        validateAgeRealTime(e.target.value);
    });

    function validateRegistrationData(data) {
        const errors = [];

        // Username validation
        if (!data.username || data.username.length < 3 || data.username.length > 20) {
            errors.push('Username must be 3-20 characters long.');
        }
        if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
            errors.push('Username can only contain letters, numbers, and underscores.');
        }

        // Email validation
        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('Please enter a valid email address.');
        }

        // Password validation
        if (!isValidPassword(data.password)) {
            errors.push('Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters.');
        }

        // Phone validation
        if (!isValidDominicanPhone(data.phone)) {
            errors.push('Phone must be a valid Dominican Republic number (809, 829, or 849 + 7 digits).');
        }

        // Age validation
        if (!isOver18(data.birthDate)) {
            errors.push('You must be at least 18 years old to register.');
        }

        return errors;
    }

    function isValidPassword(password) {
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password && password.length >= minLength && hasUppercase && hasLowercase && hasNumbers && hasSpecialChar;
    }

    function isValidDominicanPhone(phone) {
        const phoneRegex = /^(809|829|849)[0-9]{7}$/;
        return phoneRegex.test(phone);
    }

    function isOver18(birthDate) {
        if (!birthDate) return false;
        
        const today = new Date();
        const birth = new Date(birthDate);
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            return age - 1 >= 18;
        }
        return age >= 18;
    }

    function validatePasswordRealTime(password) {
        const input = document.getElementById('regPassword');
        const small = input.nextElementSibling;
        
        if (password && !isValidPassword(password)) {
            input.style.borderColor = '#ff6b6b';
            small.style.color = '#ff6b6b';
            small.textContent = 'Password must have 8+ chars, uppercase, lowercase, numbers, special characters';
        } else if (password) {
            input.style.borderColor = '#4ecdc4';
            small.style.color = '#4ecdc4';
            small.textContent = 'Password is valid!';
        } else {
            input.style.borderColor = '#e1e1e1';
            small.style.color = '#888';
            small.textContent = '8+ chars, uppercase, lowercase, numbers, special characters';
        }
    }

    function validatePhoneRealTime(phone) {
        const input = document.getElementById('regPhone');
        const small = input.nextElementSibling;
        
        if (phone && !isValidDominicanPhone(phone)) {
            input.style.borderColor = '#ff6b6b';
            small.style.color = '#ff6b6b';
            small.textContent = 'Must start with 809, 829, or 849 followed by 7 digits';
        } else if (phone) {
            input.style.borderColor = '#4ecdc4';
            small.style.color = '#4ecdc4';
            small.textContent = 'Valid Dominican phone number!';
        } else {
            input.style.borderColor = '#e1e1e1';
            small.style.color = '#888';
            small.textContent = 'Format: 809/829/849 + 7 digits';
        }
    }

    function validateAgeRealTime(birthDate) {
        const input = document.getElementById('regBirthDate');
        const small = input.nextElementSibling;
        
        if (birthDate && !isOver18(birthDate)) {
            input.style.borderColor = '#ff6b6b';
            small.style.color = '#ff6b6b';
            small.textContent = 'You must be at least 18 years old';
        } else if (birthDate) {
            input.style.borderColor = '#4ecdc4';
            small.style.color = '#4ecdc4';
            small.textContent = 'Age verified!';
        } else {
            input.style.borderColor = '#e1e1e1';
            small.style.color = '#888';
            small.textContent = 'Must be 18 years or older';
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        successMessage.classList.add('hidden');
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.classList.remove('hidden');
        errorMessage.classList.add('hidden');
    }

    function clearMessages() {
        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');
    }

    async function checkSession() {
        try {
            const response = await fetch('/api/session');
            const result = await response.json();
            
            if (result.loggedIn) {
                window.location.href = '/game';
            }
        } catch (error) {
            // User not logged in, stay on login page
        }
    }
});