import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

type Props = {
  url: string;
  imageSrc: string;
  title: string;
  description: string;
};

export function UserCapsuleExample({
  url,
  imageSrc,
  title,
  description,
}: Props) {
  return (
    <a href={url} style={{ textDecoration: 'unset' }}>
      <Card sx={{ borderRadius: 6, height: '100%' }}>
        <CardActionArea>
          <CardMedia
            sx={{ height: 170 }}
            image={imageSrc}
            title="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </a>
  );
}
