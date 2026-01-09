import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
}) => {
    const baseStyles: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius)',
        fontWeight: 600,
        transition: 'all 0.2s ease',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.7 : 1,
        width: fullWidth ? '100%' : 'auto',
        gap: '0.5rem',
    };

    const variants = {
        primary: {
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            boxShadow: 'var(--shadow-sm)',
        },
        secondary: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
        },
        outline: {
            background: 'transparent',
            color: 'var(--primary)',
            border: '1px solid var(--primary)',
        },
        danger: {
            background: 'var(--error)',
            color: 'white',
            border: 'none',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--text-muted)',
            border: 'none',
        },
    };

    const sizes = {
        sm: { padding: '0.5rem 0.75rem', fontSize: '0.875rem' },
        md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
        lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
    };

    return (
        <button
            className={`${className}`}
            style={{
                ...baseStyles,
                ...variants[variant],
                ...sizes[size],
            }}
            onMouseEnter={(e) => {
                if (!props.disabled && variant === 'primary') {
                    e.currentTarget.style.background = 'var(--primary-hover)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                }
            }}
            onMouseLeave={(e) => {
                if (!props.disabled && variant === 'primary') {
                    e.currentTarget.style.background = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                }
            }}
            {...props}
        >
            {children}
        </button>
    );
};
