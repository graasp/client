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
    title: 'Integrated model for comprehensive digital education platforms',
    src: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=eDrc2o8AAAAJ&cstart=20&pagesize=80&sortby=pubdate&citation_for_view=eDrc2o8AAAAJ:8VtEwCQfWZkC',
    authors:
      'Denis Gillet, Isabelle Vonèche-Cardia, Juan Carlos Farah, Kim Lan Phan Hoang, María Jesús Rodríguez-Triana',
    date: '2022',
  },
  {
    title:
      'Understanding teacher design practices for digital inquiry–based science learning: The case of Go-Lab',
    src: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=eDrc2o8AAAAJ&cstart=20&pagesize=80&sortby=pubdate&citation_for_view=eDrc2o8AAAAJ:WWeOtg8bX_EC',
    authors:
      'Ton de Jong, Denis Gillet, María Jesús Rodríguez-Triana, Tasos Hovardas, Diana Dikke, Rosa Doran, Olga Dziabenko, Jens Koslowsky, Miikka Korventausta, Effie Law, Margus Pedaste, Evita Tasiopoulou, Gérard Vidal, Zacharias C Zacharia',
    date: '2021',
  },
  {
    title:
      'Stimulating Brainstorming Activities with Generative AI in Higher Education',
    src: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=eDrc2o8AAAAJ&sortby=pubdate&citation_for_view=eDrc2o8AAAAJ:cB__R-XWw9UC',
    authors: 'Jérémy La Scala, Sonia Sahli, Denis Gillet',
    date: '2025',
  },
  {
    title:
      'Digital Intervention for Collaborative and Human-Centered Activities in Design-Based Learning Scenarios',
    src: 'https://ieeexplore.ieee.org/abstract/document/10398356',
    authors: 'Jérémy La Scala; Isabelle Vonèche-Cardia; Denis Gillet',
    date: '2023',
  },
  {
    title:
      'Implementation Framework and Strategies for AI-Augmented Open Educational Resources (OER): A Comprehensive Approach Applied to Secondary and Higher Education',
    src: 'https://ieeexplore.ieee.org/abstract/document/10398356',
    authors:
      'Denis Gillet, Michele Notari, Basile Spacnlchauer, Thibault Reidy',
    date: '2024',
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
      'Promoting computational thinking skills in non-computer-science students: Gamifying computational notebooks to increase student engagement',
    authors:
      'Alessio De Santo, Juan Carlos Farah, Marc Lafuente Martínez, Arielle Moro, Kristoffer Bergram, Aditya Kumar Purohit, Pascal Felber, Denis Gillet, Adrian Holzer',
    date: '2022',
    src: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=eDrc2o8AAAAJ&cstart=20&pagesize=80&sortby=pubdate&citation_for_view=eDrc2o8AAAAJ:Kqc1aDSOPooC',
  },
  {
    title:
      'Supporting developers in creating web apps for education via an app development framework',
    authors: 'Juan Carlos Farah, Sandy Ingram, Denis Gillet',
    date: '2022',
    src: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=eDrc2o8AAAAJ&cstart=20&pagesize=80&sortby=pubdate&citation_for_view=eDrc2o8AAAAJ:uUvzmPk0f8oC',
  },
  {
    title:
      'Promoting and implementing digital STEM education at secondary schools in Africa',
    authors:
      'Denis Gillet, Bosun Tijani, Senam Beheton, Juan Carlos Farah, Diana Dikke, Aurelle Noutahi, Rosa Doran, Nuno RC Gomes, Sam Rich, Ton De Jong, Célia Gavaud',
    date: '2019',
    src: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=eDrc2o8AAAAJ&cstart=20&pagesize=80&sortby=pubdate&citation_for_view=eDrc2o8AAAAJ:Vr2j17o0sqMC',
  },
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
];

export function Papers() {
  return (
    <Stack maxWidth="lg" id="papers">
      <Typography variant="h2">Papers</Typography>
      <ul>
        {papers.map((p) => (
          <Paper {...p} />
        ))}
      </ul>
    </Stack>
  );
}
