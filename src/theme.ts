import { createTheme } from '@mantine/core';
import type { MantineColorsTuple } from '@mantine/core';

// カスタムカラーパレット
const primaryBlue: MantineColorsTuple = [
  '#e3f2fd',
  '#bbdefb',
  '#90caf9',
  '#64b5f6',
  '#42a5f5',
  '#3498db',
  '#2980b9',
  '#1976d2',
  '#1565c0',
  '#0d47a1',
];

const successGreen: MantineColorsTuple = [
  '#e8f5e9',
  '#c8e6c9',
  '#a5d6a7',
  '#81c784',
  '#66bb6a',
  '#27ae60',
  '#2e7d32',
  '#388e3c',
  '#1b5e20',
  '#0d3d0d',
];

const warningOrange: MantineColorsTuple = [
  '#fff3e0',
  '#ffe0b2',
  '#ffcc80',
  '#ffb74d',
  '#ffa726',
  '#e67e22',
  '#f57c00',
  '#ef6c00',
  '#e65100',
  '#bf360c',
];

export const theme = createTheme({
  primaryColor: 'primaryBlue',
  colors: {
    primaryBlue,
    successGreen,
    warningOrange,
  },
  fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  fontSizes: {
    xs: '14px',   // デフォルト: 12px
    sm: '16px',   // デフォルト: 14px
    md: '18px',   // デフォルト: 16px
    lg: '22px',   // デフォルト: 18px
    xl: '28px',   // デフォルト: 20px
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'xs',
      },
    },
  },
});
