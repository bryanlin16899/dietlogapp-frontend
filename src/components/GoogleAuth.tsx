import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBrandGoogle } from '@tabler/icons-react';
import { useState } from 'react';

export function GoogleAuth() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = () => {
        // Redirect to backend Google OAuth endpoint
        const googleAuthUrl = 'http://localhost:8000/auth/google/login';
        window.location.href = googleAuthUrl;
    };

    // Check for OAuth callback and handle user session
    const handleOAuthCallback = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            try {
                setIsLoading(true);
                // You might want to store the token in localStorage or a state management solution
                localStorage.setItem('authToken', token);

                // Optional: Fetch user details or set user state
                notifications.show({
                    title: 'Login Successful',
                    message: 'You have been logged in with Google',
                    color: 'green'
                });

                // Redirect to a dashboard or home page
                window.location.href = '/';
            } catch {
                notifications.show({
                    title: 'Login Failed',
                    message: 'Unable to complete login',
                    color: 'red'
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Call handleOAuthCallback on component mount if there's a token in the URL
    useState(() => {
        handleOAuthCallback();
    });

    return (
        <Button 
            leftSection={<IconBrandGoogle />}
            onClick={handleGoogleLogin}
            loading={isLoading}
            variant="default"
        >
            Sign in with Google
        </Button>
    );
}
