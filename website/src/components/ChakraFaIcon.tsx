import { IconProps, Icon } from '@chakra-ui/react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props extends IconProps {
  icon: IconDefinition;
}

export const ChakraFaIcon = ({ icon, ...rest }: Props) => {
  return (
    <Icon {...rest}>
      <FontAwesomeIcon icon={icon} />
    </Icon>
  );
};
