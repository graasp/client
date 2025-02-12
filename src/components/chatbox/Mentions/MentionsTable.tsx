import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Check, Close, FiberManualRecord } from '@mui/icons-material';
import {
  Button,
  Grid2 as Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  styled,
} from '@mui/material';

import { ChatMention, MentionStatus, getIdsFromPath } from '@graasp/sdk';

import { Link } from '@tanstack/react-router';

import { useAuth } from '@/AuthContext.js';
import { NS } from '@/config/constants.js';
import { mutations } from '@/config/queryClient.js';

import { MessageBody } from '../Chatbox/MessageBody.js';
import { ConfirmationDialog } from './ConfirmationDialog.js';

const StyledRow = styled(TableRow)({
  '&:hover': {
    // make the cursor a pointer to indicate we can click
    cursor: 'pointer',
  },
});

type Props = {
  mentions?: ChatMention[];
};

export function MentionsTable({ mentions }: Readonly<Props>) {
  const { user, isAuthenticated } = useAuth();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const { t } = useTranslation(NS.Chatbox);
  const patchMention = mutations.usePatchMention();
  const deleteMention = mutations.useDeleteMention();
  const clearAllMentions = mutations.useClearMentions();

  if (!isAuthenticated) {
    return null;
  }

  const markAsRead = (id: string): void => {
    patchMention.mutate({
      id: id,
      memberId: user.id,
      status: MentionStatus.Read,
    });
  };

  // todo: refactor this to another component
  const renderMentionTableContent = () => {
    if (!mentions?.length) {
      return (
        <TableRow>
          <TableCell colSpan={4}>{t('EMPTY_NOTIFICATIONS')}</TableCell>
        </TableRow>
      );
    }

    return mentions.map((m) => (
      <Link
        key={m.id}
        to="/builder/items/$itemId"
        params={{ itemId: getIdsFromPath(m.message.item.path).slice(-1)[0] }}
        search={{ chatOpen: true }}
      >
        <StyledRow hover onClick={() => markAsRead(m.id)}>
          <TableCell>
            {m.status === MentionStatus.Unread && (
              <FiberManualRecord fontSize="small" color="primary" />
            )}
          </TableCell>
          <TableCell>
            <MessageBody messageBody={m.message.body} />
          </TableCell>
          <TableCell>{m.message.creator?.name}</TableCell>
          <TableCell>
            <Grid container direction="row">
              <Grid>
                <Tooltip title={t('MARK_AS_READ')}>
                  <IconButton
                    onClick={(e): void => {
                      e.stopPropagation();
                      markAsRead(m.id);
                    }}
                  >
                    <Check color="primary" />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid>
                <Tooltip title={t('DELETE_TOOLTIP')}>
                  <IconButton
                    onClick={(e): void => {
                      e.stopPropagation();
                      deleteMention.mutate(m.id);
                    }}
                  >
                    <Close color="primary" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </TableCell>
        </StyledRow>
      </Link>
    ));
  };

  return (
    <Stack direction="column">
      <Stack direction="row" justifyContent="space-between" gap={2}>
        <Button
          variant="outlined"
          onClick={(): void => {
            mentions
              ?.filter((m) => m.status === MentionStatus.Unread)
              .map((m) =>
                patchMention.mutate({
                  id: m.id,
                  memberId: user.id,
                  status: MentionStatus.Read,
                }),
              );
          }}
        >
          {t('MARK_ALL_AS_READ')}
        </Button>
        <Button
          variant="outlined"
          onClick={(): void => setOpenConfirmation(true)}
        >
          {t('CLEAR_ALL')}
        </Button>
        <ConfirmationDialog
          open={openConfirmation}
          title={t('CLEAR_ALL_NOTIFICATIONS_TITLE')}
          content={t('CLEAR_ALL_NOTIFICATIONS_CONTENT')}
          onConfirm={(): void => {
            clearAllMentions.mutate();
            setOpenConfirmation(false);
          }}
          onCancel={(): void => setOpenConfirmation(false)}
        />
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('COL_STATUS')}</TableCell>
            <TableCell>{t('COL_MESSAGE')}</TableCell>
            <TableCell>{t('COL_BY')}</TableCell>
            <TableCell>{t('COL_ACTIONS')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderMentionTableContent()}</TableBody>
      </Table>
    </Stack>
  );
}
