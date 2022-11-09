import { Box, Group, Title, TextInput, FileInput, Text, Container} from '@mantine/core';
import { IconUpload } from '@tabler/icons';

export function Stats() {
  return (
    <Container size="xs" style={{marginTop:"20px"}}>
        <Box
        sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            textAlign: 'center',
            padding: theme.spacing.xl,
            borderRadius: theme.radius.md,
            cursor: 'pointer',

            '&:hover': {
            backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
            },
        })}
        >
        brrrr
        </Box>
    </Container>
    
  );
}