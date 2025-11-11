import { Stack, Typography } from '@mui/material';

const Paper = ({
  title,
  src,
  authors,
  date,
}: Readonly<{ title: string; src: string; authors: string; date: string }>) => {
  return (
    <li>
      <Typography
        variant="body1"
        fontWeight="bold"
        component="a"
        href={src}
        target="_blank"
      >
        {title} ({date})
      </Typography>
      <Typography variant="subtitle1">{authors}</Typography>
    </li>
  );
};

const papers = [
  {
    title:
      'Innovations in STEM education: the Go-Lab federation of online labs',
    src: 'https://link.springer.com/article/10.1186/s40561-014-0003-6',
    authors: 'Ton de Jong, Sofoklis Sotiriou, Denis Gillet',
    date: '2014',
  },
  {
    title:
      'Using Social Media for Collaborative Learning in Higher Education: A Case Study',
    src: 'https://d1wqtxts1xzle7.cloudfront.net/38756673/achi_2012_11_40_20164-libre.pdf?1442183573=&response-content-disposition=inline%3B+filename%3DUsing_social_media_for_collaborative_lea.pdf&Expires=1762880071&Signature=VbHWOOVbj5X3tCNUImkraXxRr~byPhFTM9DerDfOv3tXeUjj02YuRfgqh~zt5pjDpQSdotpWm6Lcr-X4RvTjYTBd1q88MAPkV0xHB7uyoKTUuLoBJOUxJxasjSzLU~ud6dxePc~wD5vwSkl8ajUXgyCvDh-iOAx687t1kZhAXrMKNS18JqGlRetBBQOZNL6rN8KpuDwgAU3ROsDvWLlDM-o0mCxUYnNt6DisN3GCGzBFRfMWxdUGYq-Zn9xPF4GhV5ur7P-JLodMxN6urwm5P5HVZy8HGwCOqrj7HDMWupJoDGklDm9lxLqPOR-4c271cLq-WEaHgYeDJir2xlemng__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA',
    authors: 'Na Li, Sandy El Helou, Denis Gillet',
    date: '2012',
  },

  {
    title:
      'Developing Transversal Skills and Strengthening Collaborative Blended Learning Activities in Engineering Education: a Pilot Study',
    authors:
      'Jérémy La Scala; Graciana Aad; Isabelle Vonèche-Cardia; Denis Gillet',
    date: '2022',
    src: 'https://ieeexplore.ieee.org/abstract/document/10031948',
  },
  {
    title:
      'Introducing Alternative Value Proposition Canvases for Collaborative and Blended Design Thinking Activities in Science and Engineering Education',
    authors: 'Denis Gillet; Isabelle Vonèche-Cardia; Jérémy La Scala',
    date: '2022',
    src: 'https://ieeexplore.ieee.org/abstract/document/10148548',
  },
  {
    title:
      'Application of an Inquiry-Based Learning Space (ILS) GRAASP in the Course of Differential Equations for Engineering Students Within the Framework of the Project Wp@ELAB',
    src: 'https://ieeexplore.ieee.org/abstract/document/10040873',
    authors:
      'Dayana Barrera-Buitrago; Nidia Lugo López; Freddy Torres-Payoma; Diana Carolina Herrera; Francesc Alpiste Penalba; Jordi Torner Ribé',
    date: '2022',
  },
  {
    title:
      'Digital Intervention for Collaborative and Human-Centered Activities in Design-Based Learning Scenarios',
    src: 'https://ieeexplore.ieee.org/abstract/document/10398356',
    authors: 'Jérémy La Scala; Isabelle Vonèche-Cardia; Denis Gillet',
    date: '2023',
  },
];

export function Papers() {
  return (
    <Stack maxWidth="lg" id="papers">
      <Typography variant="h2">Papers</Typography>
      <ul>
        {papers
          .toSorted((p1, p2) => (p1.date > p2.date ? -1 : 1))
          .map((p) => (
            <Paper {...p} />
          ))}
      </ul>
    </Stack>
  );
}
