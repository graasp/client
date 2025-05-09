import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import {
  ItemType,
  formatDate,
  formatFileSize,
  getFileExtra,
} from '@graasp/sdk';

import { NS } from '@/config/constants';
import { hooks } from '@/config/queryClient';
import { ITEM_PANEL_NAME_ID, ITEM_PANEL_TABLE_ID } from '@/config/selectors';

import { useOutletContext } from '~builder/contexts/OutletContext';

import { BUILDER } from '../../../langs';
import LanguageSelect from './LanguageSelect';

const { useMember } = hooks;

const ItemMetadataContent = (): JSX.Element => {
  const { t: translateBuilder, i18n } = useTranslation(NS.Builder);
  const { t: translateCommon } = useTranslation(NS.Common);
  const { item } = useOutletContext();

  const { data: creator } = useMember(item?.creator?.id);

  let size = null;
  let mimetype = null;
  if (item.type === ItemType.FILE) {
    const extra = getFileExtra(item.extra);
    mimetype = extra?.mimetype;
    size = extra?.size;
  }

  const renderLink = () => {
    const buildTableRow = (link: string) => (
      <TableRow>
        <TableCell align="left">
          {translateBuilder(BUILDER.ITEM_METADATA_LINK_TITLE)}
        </TableCell>
        <TableCell align="right">{link}</TableCell>
      </TableRow>
    );
    if (item.type === ItemType.APP) {
      return buildTableRow(item.extra[ItemType.APP].url);
    }
    if (item.type === ItemType.LINK) {
      return buildTableRow(item.extra[ItemType.LINK].url);
    }
    return null;
  };

  return (
    <Box>
      <TableContainer sx={{ boxSizing: 'border-box' }}>
        <Typography variant="h5" id={ITEM_PANEL_NAME_ID} noWrap>
          {item.name}
        </Typography>
        <Table
          id={ITEM_PANEL_TABLE_ID}
          size="small"
          aria-label={translateBuilder(BUILDER.ITEM_METADATA_TITLE)}
        >
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                {translateBuilder(BUILDER.ITEM_METADATA_TYPE_TITLE)}
              </TableCell>
              <TableCell align="right">{mimetype ?? item.type}</TableCell>
            </TableRow>
            {size && (
              <TableRow>
                <TableCell component="th" scope="row">
                  {translateBuilder(BUILDER.ITEM_METADATA_SIZE_TITLE)}
                </TableCell>
                <TableCell align="right">{formatFileSize(size)}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell align="left">
                {translateBuilder(BUILDER.ITEM_METADATA_CREATOR_TITLE)}
              </TableCell>
              <TableCell align="right">{creator?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">
                {translateBuilder(BUILDER.ITEM_METADATA_CREATED_AT_TITLE)}
              </TableCell>
              <TableCell align="right">
                {formatDate(item.createdAt, {
                  locale: i18n.language,
                  defaultValue: translateCommon('UNKNOWN_DATE'),
                })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left">
                {translateBuilder(BUILDER.ITEM_METADATA_UPDATED_AT_TITLE)}
              </TableCell>
              <TableCell align="right">
                {formatDate(item.updatedAt, {
                  locale: i18n.language,
                  defaultValue: translateCommon('UNKNOWN_DATE'),
                })}
              </TableCell>
            </TableRow>
            {renderLink()}
            <TableRow>
              <TableCell align="left">
                {translateBuilder(BUILDER.ITEM_METADATA_LANGUAGE_TITLE)}
              </TableCell>
              <TableCell align="right">
                <LanguageSelect item={item} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ItemMetadataContent;
