import { useTranslation } from 'react-i18next';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from '@mui/material';

import { ChevronDown } from 'lucide-react';

import { NS } from '@/config/constants';

export function Faq() {
  const { t } = useTranslation(NS.Landing, { keyPrefix: 'SUPPORT.FAQ' });

  const QUESTIONS = [
    {
      question: 'How can I get started?',
      answer: 'hello',
    },
    {
      question: 'What is the difference between Builder and Player?',
      answer: 'hello',
    },
    {
      question: 'Do you provide training?',
      answer: 'hello',
    },
    {
      question:
        'How can I import my already existing content from another platform to Graasp?',
      answer: 'hello',
    },
  ];

  return (
    <Stack
      mt={8}
      maxWidth={{ xs: '600px', md: 'lg' }}
      width="100%"
      alignItems={{ xs: 'center', md: 'flex-start' }}
      gap={3}
    >
      <Typography color="primary" variant="h3">
        {t('TITLE')}
      </Typography>

      <Typography>{t('DESCRIPTION_1')}</Typography>
      <Typography>{t('DESCRIPTION_2')}</Typography>

      <Box
        width="100%"
        borderRadius={5}
        overflow="hidden"
        boxShadow={'0 2px 5px lightgrey'}
      >
        {QUESTIONS.map(({ question, answer }) => (
          <Accordion
            key={question}
            elevation={0}
            sx={{
              background: 'transparent',
              '&.Mui-expanded': { margin: '3px 0' },
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronDown />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{ background: 'white', py: 1, px: 3 }}
            >
              <Typography fontWeight="bold">{question}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ py: 2, px: 3 }}>
              <Typography>{answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Stack>
  );
}
