'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    delay?: string | number;
    iconColorClass?: string;
    hoverColorClass?: string;
}

export function FeatureCard({
    icon: Icon,
    title,
    description,
    delay = '0s',
    iconColorClass = 'text-primary-foreground',
    hoverColorClass = 'group-hover:text-primary'
}: FeatureCardProps) {
    return (
        <Card
            className="border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group animate-scale-in overflow-hidden relative"
            style={{ animationDelay: typeof delay === 'number' ? `${delay}s` : delay }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-8 relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    <Icon className={`h-7 w-7 ${iconColorClass}`} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${hoverColorClass} transition-colors`}>{title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}
