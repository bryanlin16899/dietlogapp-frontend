import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBrandGoogle } from '@tabler/icons-react';
import { useState } from 'react';

export function GoogleAuth() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = () => {
        // Redirect to backend Google OAuth endpoint
        const googleAuthUrl = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login` : 'http://localhost:8000/auth/google/login';
        window.location.href = googleAuthUrl;
    };

    // Check for OAuth callback and handle user session
    const handleOAuthCallback = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const googleId = urlParams.get('id');
        const existsUserInfo = localStorage.getItem('userInfo');

        if (googleId && !existsUserInfo) {
            try {
                setIsLoading(true);
                // You might want to store the token in localStorage or a state management solution
                const userId = urlParams.get('user_id');
                const name = urlParams.get('name');
                const email = urlParams.get('email');
                const picture = urlParams.get('picture');

                if (googleId && userId && name && email) {
                    const userInfo = {
                        googleId,
                        userId,
                        name: decodeURIComponent(name),
                        email,
                        picture
                    };

                    localStorage.setItem('userInfo', JSON.stringify(userInfo));
                    // Optional: Fetch user details or set user state
                    notifications.show({
                        position: 'top-right',
                        title: '登入成功',
                        message: `${name}, 歡迎回來!`,
                        color: 'green'
                    });
                }


                // // Redirect to a dashboard or home page
                // window.location.href = '/';
            } catch {
                notifications.show({
                    title: '登入失敗',
                    message: '無法登入',
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
