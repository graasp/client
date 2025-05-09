import { type JSX, type ReactNode } from 'react';

import {
  FileItemExtra,
  ItemType,
  MimeTypes,
  UnionOfConst,
  getMimetype,
} from '@graasp/sdk';

import {
  AppWindowIcon,
  CableIcon,
  ClapperboardIcon,
  FileIcon,
  FileTextIcon,
  FileUpIcon,
  FolderArchiveIcon,
  FolderIcon,
  ImageIcon,
  LinkIcon,
  Music2Icon,
  TextIcon,
} from 'lucide-react';

import { StyledImage } from '../StyledComponents/StyledBaseComponents.js';
import EtherpadIcon from './EtherpadIcon.js';
import H5PIcon from './H5PIcon.js';

const MAX_ICON_SIZE = '25px';

export type ItemIconProps = {
  alt: string;
  /**
   * item type
   */
  type: UnionOfConst<typeof ItemType> | 'upload';
  /**
   * An HTML Color to use for the foreground of the icon
   */
  color?: string;
  /**
   * @deprecated Use the `mimetype` prop.
   * To extract the mimetype from the item extra use the `getMimetype` function exported from @graasp/sdk
   * Item extra used to define the mimetype
   */
  extra?: FileItemExtra;
  mimetype?: string;
  iconSrc?: string;
  size?: string;
};

const ItemIcon = ({
  color,
  extra,
  mimetype: defaultMimetype,
  iconSrc,
  alt = '',
  size = MAX_ICON_SIZE,
  type,
}: ItemIconProps): JSX.Element => {
  const mimetype = extra ? getMimetype(extra) : defaultMimetype;

  if (iconSrc) {
    return (
      <StyledImage
        sx={{
          // icons should be squared
          maxHeight: size,
          maxWidth: size,
          height: size,
          width: size,
          objectFit: 'cover',
          borderRadius: 1,
        }}
        alt={alt}
        src={iconSrc}
      />
    );
  }

  let Icon: ({
    size,
    color,
  }: {
    size: string | number;
    color?: string;
  }) => JSX.Element | ReactNode = FileIcon;
  switch (type) {
    case ItemType.FOLDER:
      Icon = FolderIcon;
      break;
    case ItemType.SHORTCUT:
      Icon = CableIcon;
      break;
    case ItemType.DOCUMENT: {
      Icon = TextIcon;
      break;
    }
    case ItemType.FILE: {
      if (mimetype) {
        if (MimeTypes.isImage(mimetype)) {
          Icon = ImageIcon;
          break;
        }
        if (MimeTypes.isVideo(mimetype)) {
          Icon = ClapperboardIcon;
          break;
        }
        if (MimeTypes.isAudio(mimetype)) {
          Icon = Music2Icon;
          break;
        }
        if (MimeTypes.isPdf(mimetype)) {
          Icon = FileTextIcon;
          break;
        }
        if (MimeTypes.isZip(mimetype)) {
          Icon = FolderArchiveIcon;
          break;
        }
      }

      Icon = FileIcon;
      break;
    }
    case ItemType.LINK: {
      Icon = LinkIcon;
      break;
    }
    case ItemType.APP: {
      Icon = AppWindowIcon;
      break;
    }
    case ItemType.H5P: {
      Icon = H5PIcon;
      break;
    }
    case ItemType.ETHERPAD: {
      Icon = EtherpadIcon;
      break;
    }
    case 'upload': {
      Icon = FileUpIcon;
      break;
    }
    default:
      break;
  }

  return <Icon color={color} size={size} />;
};

export default ItemIcon;
