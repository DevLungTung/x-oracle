'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',

          '--success-bg': 'var(--success)',
          '--success-text': 'white',
          '--success-border': 'var(--success)',

          '--error-bg': 'var(--destructive)',
          '--error-text': 'white',
          '--error-border': 'var(--destructive)',

          '--warning-bg': 'var(--warning)',
          '--warning-text': 'var(--warning-foreground)',
          '--warning-border': 'var(--warning)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
