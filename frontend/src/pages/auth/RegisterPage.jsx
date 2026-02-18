import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const registerSchema = z.object({
    firstName: z.string().min(2, 'First name too short'),
    lastName: z.string().min(2, 'Last name too short'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const RegisterPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.login);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/register', data);
            const { accessToken, user } = response.data;

            setAuth(user, accessToken);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Create an account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email below to create your account
                </p>
            </div>
            <div className="grid gap-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-1">
                                <Label className="sr-only" htmlFor="firstName">First Name</Label>
                                <Input id="firstName" placeholder="First Name" {...register('firstName')} disabled={isLoading} />
                                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                            </div>
                            <div className="grid gap-1">
                                <Label className="sr-only" htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" placeholder="Last Name" {...register('lastName')} disabled={isLoading} />
                                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                            </div>
                        </div>

                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="email">
                                Email
                            </Label>
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                disabled={isLoading}
                                {...register('email')}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="password">
                                Password
                            </Label>
                            <Input
                                id="password"
                                placeholder="Password"
                                type="password"
                                disabled={isLoading}
                                {...register('password')}
                            />
                            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                        </div>
                        <Button disabled={isLoading} isLoading={isLoading}>
                            Sign Up with Email
                        </Button>
                    </div>
                </form>
                <div className="text-center text-sm">
                    Already have an account?{' '}
                    <Link to="/auth/login" className="underline hover:text-primary">
                        Login
                    </Link>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
