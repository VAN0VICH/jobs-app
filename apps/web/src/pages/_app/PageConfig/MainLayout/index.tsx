import React, { FC, ReactElement } from 'react';
import { AppShell, Stack } from '@mantine/core';

interface MainLayoutProps {
  children: ReactElement;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => (
  <AppShell component={Stack} bg="gray.0">
    <AppShell.Main p={32} pt={104}>
      {children}
    </AppShell.Main>
  </AppShell>
);

export default MainLayout;
