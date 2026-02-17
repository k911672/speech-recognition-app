import React from 'react';
import { Button } from '@mantine/core';

interface ControlButtonProps {
  onClick: () => void;
  variant: "text" | "outlined" | "contained";
  color: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  children: React.ReactNode;
}

// MUI variant を Mantine variant にマッピング
const variantMap: Record<string, "subtle" | "outline" | "filled" | "default"> = {
  text: "subtle",
  outlined: "outline",
  contained: "filled",
};

// MUI color を Mantine color にマッピング
const colorMap: Record<string, string> = {
  inherit: "gray",
  primary: "primaryBlue",
  secondary: "violet",
  success: "successGreen",
  error: "red",
  info: "cyan",
  warning: "warningOrange",
};

const ControlButton = ({onClick, variant, color, children}: ControlButtonProps) => {
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick();
    e.currentTarget.blur();
  };

  const mantineVariant = variantMap[variant] || "filled";
  const mantineColor = colorMap[color] || "primaryBlue";
  
  return (
    <Button 
      onClick={handleClick} 
      variant={mantineVariant}
      color={mantineColor}
      size="lg"
      w={{ base: 150, sm: 200 }}
      h={{ base: 50, sm: 60 }}
      px={{ base: 'lg', sm: 'xl' }}
      py={{ base: 'sm', sm: 'md' }}
      styles={{
        root: {
          fontWeight: 700,
          fontSize: '20px',
        },
      }}
    >
      {children}
    </Button>
  )
}

export default ControlButton;