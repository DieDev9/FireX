export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    priority: NotificationPriority;
    read: boolean;
    actionUrl?: string;
    createdAt: string;
}

export interface NotificationPreferences {
    emailEnabled: boolean;
    pushEnabled: boolean;
    orderNotifications: boolean;
    serviceNotifications: boolean;
    promotionalNotifications: boolean;
}
