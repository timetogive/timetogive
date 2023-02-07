import { Box } from '@chakra-ui/layout';
import { BoxProps } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  rootProps?: BoxProps;
}

export const ContentWrapper = ({ children, rootProps }: Props) => {
  return (
    <Box maxW="7xl" mx="auto" px={3} {...rootProps}>
      {children}
    </Box>
  );
};
