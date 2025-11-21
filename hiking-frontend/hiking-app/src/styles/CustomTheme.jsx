import React from 'react';
import { ConfigProvider } from 'antd';

export const customTheme = {
  token: {
    colorText: 'white',
    colorPrimary: '#43815c',
    colorPrimaryHover: '#70d098',
  },
  components: {
    Form: {
      labelColor: '#fff',
    },
    Input: {
      activeBorderColor: 'gray',
      hoverBorderColor: 'darkgray',
      // hoverBg: 'rgb(190, 187, 187)',
    },
  },
};

export const CustomThemeProvider = ({ children }) => (
  <ConfigProvider theme={customTheme}>{children}</ConfigProvider>
);
