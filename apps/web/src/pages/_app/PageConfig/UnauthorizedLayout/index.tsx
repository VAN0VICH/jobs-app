import React, { FC, ReactElement } from 'react';
import { Box, Image, SimpleGrid } from '@mantine/core';

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => (
  <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="sm" w="100vw">
    <Image h="100vh" src="/images/ship.svg" alt="App Info" visibleFrom="xl" />

    <Box h="100vh" w="100%" pt={100} px={32}>
      {children}
    </Box>
  </SimpleGrid>
);

export default UnauthorizedLayout;
