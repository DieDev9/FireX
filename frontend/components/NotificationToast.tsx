import React from 'react';
import { NotificationPriority, NotificationType } from '@/types/notification';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface NotificationToastProps {
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
    title,
    message,
    type,
    priority
}) => {
    const getIcon = () => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'WARNING': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'ERROR': return <AlertCircle className="h-5 w-5 text-red-500" />;
            default: return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const getPriorityColor = () => {
        switch (priority) {
            case 'URGENT': return 'border-l-4 border-red-500';
            case 'HIGH': return 'border-l-4 border-orange-500';
            default: return '';
        }
    };

    return (
        <div className={`flex items-start gap-3 ${getPriorityColor()} pl-2`}>
            {getIcon()}
            <div className="flex-1">
                <h4 className="font-semibold text-sm">{title}</h4>
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
        </div>
    );
};
