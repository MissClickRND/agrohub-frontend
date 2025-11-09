import { Button, Text, useMantineTheme } from '@mantine/core';
import {IconSearch} from "@tabler/icons-react";

type Props = {
  onClick?: () => void;
};

function AgrohubSpotlightButton({ onClick }: Props) {
  const theme = useMantineTheme();

  return (
    <Button
      onClick={onClick}
      w={300}
      style={{ cursor: 'text', borderColor: 'var(--white-gray)' }}
      variant={'outline'}
      justify={'start'}
      leftSection={<IconSearch color={theme.colors.primary[4]} />}
    >
      <Text c={"black"} fw={"500"} fz={12}>
        Поиск...
      </Text>
    </Button>
  );
}

export default AgrohubSpotlightButton;
