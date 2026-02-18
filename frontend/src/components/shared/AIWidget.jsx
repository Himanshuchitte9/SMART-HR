import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const AIWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <div className="w-80 rounded-lg border bg-card shadow-xl">
                    <div className="flex items-center justify-between border-b p-4">
                        <h3 className="font-semibold">AI Assistant</h3>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="h-64 overflow-y-auto p-4 text-sm">
                        <div className="mb-2 text-muted-foreground">
                            Hello! I'm your SmartHR AI assistant. How can I help you today?
                        </div>
                    </div>
                    <div className="border-t p-3">
                        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                            <Input placeholder="Ask anything..." />
                            <Button size="sm">Send</Button>
                        </form>
                    </div>
                </div>
            ) : (
                <Button
                    className="h-14 w-14 rounded-full shadow-lg"
                    onClick={() => setIsOpen(true)}
                >
                    <MessageSquare className="h-6 w-6" />
                </Button>
            )}
        </div>
    );
};

export default AIWidget;
