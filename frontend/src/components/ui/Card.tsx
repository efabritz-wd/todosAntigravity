import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`glass-panel rounded-xl p-6 ${className}`}
            style={{
                borderRadius: 'var(--radius)',
                padding: '2rem',
            }}
            {...props}
        >
            {children}
        </div>
    );
};
