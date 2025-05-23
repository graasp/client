import { type JSX, memo, useEffect, useState } from 'react';

import { Alert, Box, Skeleton } from '@mui/material';

import {
  FileItemType,
  MimeTypes,
  formatFileSize,
  getFileExtra,
} from '@graasp/sdk';

import { Errors } from '@/ui/enums/errors.js';

import withCollapse from '../Collapse/withCollapse.js';
import { SCREEN_MAX_HEIGHT, UNEXPECTED_ERROR_MESSAGE } from '../constants.js';
import DownloadButtonFileItem from './DownloadButtonFileItem.js';
import FileAudio from './FileAudio.js';
import FileImage from './FileImage.js';
import FilePdf from './FilePdf.js';
import FileVideo from './FileVideo.js';
import { SizingWrapper } from './SizingWrapper.js';
import { CaptionWrapper } from './withCaption.js';

export type FileItemProps = {
  /**
   * blob content of the file, overridden by fileUrl
   * */
  content?: Blob;
  /**
   * url of the file, overrides content
   * */
  fileUrl?: string;
  defaultItem?: JSX.Element;
  errorMessage?: string;
  id?: string;
  item: FileItemType;
  maxHeight?: number | string;
  /**
   * use a custom pdf reader from the link if defined
   * */
  pdfViewerLink?: string;
  showCollapse?: boolean;
  onClick?: () => void;
  onCollapse?: (c: boolean) => void;
};

const FileItem = ({
  content,
  fileUrl,
  defaultItem,
  errorMessage = UNEXPECTED_ERROR_MESSAGE,
  id,
  item,
  maxHeight = '100%',
  showCollapse,
  pdfViewerLink,
  onClick,
  onCollapse,
}: FileItemProps): JSX.Element => {
  const [url, setUrl] = useState<string>();

  useEffect(
    () => {
      (async () => {
        if (fileUrl) {
          setUrl(fileUrl);
        } else if (content) {
          // Build a URL from the file
          const urlFromContent = URL.createObjectURL(content);
          if (urlFromContent) {
            setUrl(urlFromContent);
          } else {
            setUrl(Errors.BlobURL);
          }
        }

        return () => {
          if (content && url) {
            URL.revokeObjectURL(url);
          }
        };
      })();
      // does not include url to avoid infinite loop
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [content, fileUrl],
  );

  if (!url) {
    return (
      <Skeleton
        variant="rectangular"
        width={'100%'}
        height={maxHeight || SCREEN_MAX_HEIGHT}
      />
    );
  }

  if (url === Errors.BlobURL) {
    return <Alert severity="error">{errorMessage}</Alert>;
  }

  const getComponent = (): JSX.Element => {
    const fileExtra = getFileExtra(item.extra);
    const { mimetype, altText, size } = fileExtra;

    if (mimetype) {
      if (MimeTypes.isImage(mimetype)) {
        return (
          /* The box prevent the image to take full available space due to the stack */
          <Box>
            <FileImage id={id} url={url} alt={altText || item.name} />
          </Box>
        );
      } else if (MimeTypes.isAudio(mimetype)) {
        return <FileAudio id={id} url={url} type={mimetype} />;
      } else if (MimeTypes.isVideo(mimetype)) {
        // does not specify mimetype in video source, this way, it works with more container formats in more browsers (especially Chrome with video/quicktime)
        return <FileVideo id={id} url={url} />;
      } else if (MimeTypes.isPdf(mimetype)) {
        return (
          <FilePdf
            id={id}
            url={url}
            height={maxHeight}
            showCollapse={showCollapse}
            pdfViewerLink={pdfViewerLink}
          />
        );
      }
    }

    if (defaultItem) {
      return defaultItem;
    }

    return (
      <DownloadButtonFileItem
        id={id}
        name={item.name}
        caption={size ? formatFileSize(size) : undefined}
        url={url}
        onClick={onClick}
      />
    );
  };

  let fileItem = getComponent();

  fileItem = (
    <SizingWrapper size={item.settings.maxWidth}>{fileItem}</SizingWrapper>
  );

  // display element with caption
  fileItem = <CaptionWrapper item={item}>{fileItem}</CaptionWrapper>;

  if (showCollapse) {
    fileItem = withCollapse({ item, onCollapse })(fileItem);
  }

  return fileItem;
};

export default memo(FileItem);
