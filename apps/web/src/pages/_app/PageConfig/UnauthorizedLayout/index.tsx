import React, { FC, ReactElement } from 'react';
import { Box, Flex } from '@mantine/core';

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => (
  <Flex w="100vw">
    <Box h="100vh" w="100%" miw={1000} pt={100} px={32}>
      {children}
    </Box>
  </Flex>
);

export default UnauthorizedLayout;
