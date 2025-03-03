import { type JSX, ReactEventHandler, useRef, useState } from 'react';

import { SxProps, styled } from '@mui/material';

import { ITEM_MAX_HEIGHT } from './constants.js';

type FilePdfProps = {
  id?: string;
  url: string;
  height?: number | string;
  sx?: SxProps;
  showCollapse?: boolean;
  /**
   * use a custom pdf reader from the link if defined
   * */
  pdfViewerLink?: string;
};

const StyledEmbed = styled('embed')({
  maxHeight: ITEM_MAX_HEIGHT,
});

const FilePdf = ({
  url,
  id,
  sx,
  height: defaultHeight,
  showCollapse,
  pdfViewerLink,
}: FilePdfProps): JSX.Element => {
  const embedRef = useRef<HTMLEmbedElement>(null);
  const [height, setHeight] = useState<number | string>(
    defaultHeight ?? '100%',
  );

  const onLoad: ReactEventHandler<HTMLEmbedElement> = (e) => {
    // only set pdf height if not using collapse
    if (!showCollapse) {
      // set pdf height -> probably very high
      const newHeight = (e.target as HTMLEmbedElement)?.offsetParent
        ?.scrollHeight;
      if (newHeight) {
        setHeight(newHeight);
      }
    }
  };

  // use custom pdf viewer if defined
  let urlWithPdfViewer = url;
  if (pdfViewerLink) {
    urlWithPdfViewer = `${pdfViewerLink}${encodeURIComponent(url)}`;
  }

  return (
    <StyledEmbed
      ref={embedRef}
      id={id}
      src={urlWithPdfViewer}
      width="100%"
      height={height || '100%'}
      onLoad={onLoad}
      sx={sx}
    />
  );
};

export default FilePdf;
