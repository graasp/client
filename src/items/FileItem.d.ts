import { Map } from 'immutable';
import React from 'react';

interface FileItemProps {
  item: Map;
  content: Blob;
  defaultItem?: React.FC;
  defaultText?: string;
  maxHeight?: number;
}

declare const FileItem: React.FC<FileItemProps>;
