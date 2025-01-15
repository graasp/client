import { Helmet } from 'react-helmet-async';

import { Container, Stack, Typography } from '@mui/material';

type Props = {
  id?: string;
  children: JSX.Element;
  options?: JSX.Element;
  title: string;
};

export function BuilderPageLayout({
  id,
  children,
  options,
  title,
}: Readonly<Props>): JSX.Element | null {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Container id={id} sx={{ pt: 1, height: '100%' }}>
        <Stack height="100%">
          <Stack
            mb={2}
            direction="row"
            justifyContent="space-between"
            spacing={1}
          >
            <Typography
              variant="h2"
              component="h1"
              sx={{ wordWrap: 'break-word' }}
            >
              {title}
            </Typography>
            {options}
          </Stack>
          {children}
        </Stack>
      </Container>
    </>
  );
}