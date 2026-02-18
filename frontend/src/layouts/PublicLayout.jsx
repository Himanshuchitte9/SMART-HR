import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const PublicLayout = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 w-full glass border-b border-white/10">
                <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                    <div className="flex gap-6 md:gap-10">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="inline-block font-bold">SMARTHR-360</span>
                        </Link>
                        <nav className="flex gap-6">
                            <Link
                                to="#features"
                                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                                Features
                            </Link>
                            <Link
                                to="#pricing"
                                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                                Pricing
                            </Link>
                            <Link
                                to="#about"
                                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                                About
                            </Link>
                        </nav>
                    </div>
                    <div className="flex flex-1 items-center justify-end space-x-4">
                        <nav className="flex items-center space-x-2">
                            <Link to="/auth/login">
                                <Button variant="ghost" size="sm">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/auth/register">
                                <Button size="sm">Get Started</Button>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by SMARTHR Team. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
