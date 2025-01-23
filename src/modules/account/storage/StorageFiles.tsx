import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';

import { formatDate, formatFileSize } from '@graasp/sdk';

import { Link } from '@tanstack/react-router';

import { NS } from '@/config/constants';
import { hooks } from '@/config/queryClient';
import {
  MEMBER_STORAGE_FILE_NAME_ID,
  MEMBER_STORAGE_FILE_SIZE_ID,
  MEMBER_STORAGE_FILE_UPDATED_AT_ID,
  MEMBER_STORAGE_PARENT_FOLDER_ID,
  getCellId,
} from '@/config/selectors';

export const StorageFiles = (): JSX.Element | null => {
  const { t, i18n } = useTranslation(NS.Account);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const { data, isLoading } = hooks.useMemberStorageFiles(pagination);

  const handlePageChange = (_: unknown, newPage: number) => {
    setPagination((prev) => {
      if (prev.page !== newPage + 1) {
        return { ...prev, page: newPage + 1 };
      }
      return prev;
    });
  };

  const handlePageSizeChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const newSize = parseInt(event.target.value, 10);
    setPagination((prev) => {
      if (prev.pageSize !== newSize) {
        return { page: 1, pageSize: newSize };
      }
      return prev;
    });
  };

  if (data) {
    if (data.data.length === 0) {
      return <Alert severity="info">{t('MEMBER_STORAGE_FILES_EMPTY')}</Alert>;
    }

    return (
      <>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('MEMBER_STORAGE_FILE_NAME')}</TableCell>
              <TableCell>{t('MEMBER_STORAGE_FILE_SIZE')}</TableCell>
              <TableCell>{t('MEMBER_STORAGE_FILE_UPDATED_AT')}</TableCell>
              <TableCell>{t('MEMBER_STORAGE_PARENT_FOLDER')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((file) => (
              <TableRow key={file.id}>
                <TableCell
                  id={getCellId(`${MEMBER_STORAGE_FILE_NAME_ID}`, file.id)}
                >
                  <Link
                    to="/builder/items/$itemId"
                    params={{ itemId: file.id }}
                  >
                    {file.name}
                  </Link>
                </TableCell>
                <TableCell
                  id={getCellId(`${MEMBER_STORAGE_FILE_SIZE_ID}`, file.id)}
                >
                  {formatFileSize(file.size)}
                </TableCell>
                <TableCell
                  id={getCellId(
                    `${MEMBER_STORAGE_FILE_UPDATED_AT_ID}`,
                    file.id,
                  )}
                >
                  {formatDate(file.updatedAt, { locale: i18n.language })}
                </TableCell>
                <TableCell
                  id={getCellId(`${MEMBER_STORAGE_PARENT_FOLDER_ID}`, file.id)}
                >
                  {file.parent?.name ?? t('MEMBER_STORAGE_NO_PARENT')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data.totalCount} // total number of files
          page={pagination.page - 1} // current page
          onPageChange={(event, newPage) => handlePageChange(event, newPage)}
          rowsPerPage={pagination.pageSize}
          onRowsPerPageChange={handlePageSizeChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </>
    );
  }

  if (isLoading) {
    return <Skeleton />;
  }

  return <Alert severity="error">{t('MEMBER_STORAGE_FILES_ERROR')}</Alert>;
};
