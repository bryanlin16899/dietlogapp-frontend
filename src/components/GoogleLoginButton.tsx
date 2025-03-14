'use client';

import { Button } from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons-react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { notifications } from '@mantine/notifications';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function GoogleLoginButton({ 
  onSuccess, 
  onError 
}: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      
      // Call your backend Google OAuth endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`, {
        method: 'POST',
        credentials: 'include', // Important for cookies
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Google login failed');
      }

      const { token } = await response.json();

      // Use NextAuth to sign in with the token
      const result = await signIn('credentials', {
        token,
        redirect: false // Prevent automatic redirection
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      notifications.show({
        title: '登入成功',
        message: '歡迎使用',
        color: 'green'
      });

      onSuccess && onSuccess();
    } catch (error) {
      console.error('Google login error:', error);
      
      notifications.show({
        title: '登入失敗',
        message: error instanceof Error ? error.message : '無法登入',
        color: 'red'
      });

      onError && onError(error instanceof Error ? error.message : '登入失敗');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      leftSection={<IconBrandGoogle />}
      onClick={handleGoogleLogin}
      loading={isLoading}
      variant="default"
      fullWidth
    >
      使用 Google 登入
    </Button>
  );
}
