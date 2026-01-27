import React, { ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon, children, className, ...props }, ref) => {
        return (
            <button ref={ref} className={`icon-btn ${className || ''}`} {...props}>
                {icon}
                {children}
            </button>
        );
    }
);

IconButton.displayName = 'IconButton';

export default IconButton;
