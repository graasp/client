import { Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

type Props = {
  url: string;
  imageSrc: string;
  title: string;
  // description: string;
};

export function UserCapsuleExample({
  url,
  imageSrc,
  title,
  description,
}: Props) {
  return (
    <Card sx={{ borderRadius: 6, width: '100%', height: '100%' }}>
      <CardActionArea
        LinkComponent={'a'}
        href={url}
        sx={{ width: '100%', height: '100%' }}
      >
        <CardMedia
          component="img"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src={imageSrc}
          alt={title}
        />
      </CardActionArea>
    </Card>
  );
}
