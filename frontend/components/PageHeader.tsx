'use client';

interface PageHeaderProps {
    title: React.ReactNode;
    description: string;
    className?: string;
}

export function PageHeader({ title, description, className = '' }: PageHeaderProps) {
    return (
        <div className={`mb-8 animate-fade-in ${className}`}>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {title}
            </h1>
            <p className="text-muted-foreground text-lg">
                {description}
            </p>
        </div>
    );
}
