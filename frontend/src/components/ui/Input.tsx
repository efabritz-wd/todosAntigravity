import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
            {label && (
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {label}
                </label>
            )}
            <input
                className={className}
                style={{
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text)',
                    fontSize: '1rem',
                    width: '100%',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxShadow: 'var(--shadow-sm)',
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary)';
                    e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'var(--shadow-sm)';
                }}
                {...props}
            />
        </div>
    );
};
