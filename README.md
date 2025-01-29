# Graasp Account
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![GitHub Release](https://img.shields.io/github/release/graasp/graasp-library)](https://github.com/graasp-account/releases)
![typescript version](https://img.shields.io/github/package-json/dependency-version/graasp/graasp-library/dev/typescript)
[![gitlocalized](https://gitlocalize.com/repo/9998/whole_project/badge.svg)](https://gitlocalize.com/repo/9998?utm_source=badge)

## Translation status

[![gitlocalized-fr](https://gitlocalize.com/repo/9998/fr/badge.svg)](https://gitlocalize.com/repo/9998/fr?utm_source=badge)  
[![gitlocalized-de](https://gitlocalize.com/repo/9998/de/badge.svg)](https://gitlocalize.com/repo/9998/de?utm_source=badge)  
[![gitlocalized-es](https://gitlocalize.com/repo/9998/es/badge.svg)](https://gitlocalize.com/repo/9998/es?utm_source=badge)  
[![gitlocalized-it](https://gitlocalize.com/repo/9998/it/badge.svg)](https://gitlocalize.com/repo/9998/it?utm_source=badge)  
[![gitlocalized-ar](https://gitlocalize.com/repo/9998/ar/badge.svg)](https://gitlocalize.com/repo/9998/ar?utm_source=badge)  

## Environment variables

```sh
# .env.development
VITE_VERSION=local
VITE_PORT=3114
VITE_GRAASP_API_HOST=http://localhost:3000
VITE_SHOW_NOTIFICATIONS=true

VITE_UMAMI_WEBSITE_ID=<the id of your umami project>
VITE_UMAMI_HOST=http://localhost:8000

VITE_SENTRY_ENV= # some value
VITE_SENTRY_DSN= # some value

VITE_RECAPTCHA_SITE_KEY= # some value

VITE_GRAASP_H5P_INTEGRATION_URL= # the origin for the h5p integration
VITE_GOOGLE_KEY= # a google api key for using the google map in analytics
```

## Test setup

```sh
# .env.test
VITE_VERSION=local
VITE_PORT=3333
VITE_GRAASP_API_HOST=http://localhost:3636
VITE_SHOW_NOTIFICATIONS=true
VITE_GRAASP_ANALYZER_HOST=http://localhost:3005

```

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/kim-lan-phan-hoang-a457bb130"><img src="https://avatars.githubusercontent.com/u/11229627?v=4?s=100" width="100px;" alt="Kim Lan Phan Hoang"/><br /><sub><b>Kim Lan Phan Hoang</b></sub></a><br /><a href="https://github.com/graasp/client/commits?author=pyphilia" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/chau-alexandre/"><img src="https://avatars.githubusercontent.com/u/14943421?v=4?s=100" width="100px;" alt="Alexandre Chau"/><br /><sub><b>Alexandre Chau</b></sub></a><br /><a href="https://github.com/graasp/client/commits?author=dialexo" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/spaenleh"><img src="https://avatars.githubusercontent.com/u/39373170?v=4?s=100" width="100px;" alt="Basile Spaenlehauer"/><br /><sub><b>Basile Spaenlehauer</b></sub></a><br /><a href="https://github.com/graasp/client/commits?author=spaenleh" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ReidyT"><img src="https://avatars.githubusercontent.com/u/147397675?v=4?s=100" width="100px;" alt="Thibault Reidy"/><br /><sub><b>Thibault Reidy</b></sub></a><br /><a href="https://github.com/graasp/client/commits?author=ReidyT" title="Tests">⚠️</a> <a href="https://github.com/graasp/client/commits?author=ReidyT" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/MartinaVin"><img src="https://avatars.githubusercontent.com/u/47863122?v=4?s=100" width="100px;" alt="Martina Vincoli"/><br /><sub><b>Martina Vincoli</b></sub></a><br /><a href="#design-MartinaVin" title="Design">🎨</a> <a href="#translation-MartinaVin" title="Translation">🌍</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/swouf"><img src="https://avatars.githubusercontent.com/u/5767619?v=4?s=100" width="100px;" alt="Jérémy La Scala"/><br /><sub><b>Jérémy La Scala</b></sub></a><br /><a href="https://github.com/graasp/client/commits?author=swouf" title="Code">💻</a> <a href="https://github.com/graasp/client/issues?q=author%3Aswouf" title="Bug reports">🐛</a> <a href="https://github.com/graasp/client/commits?author=swouf" title="Tests">⚠️</a> <a href="#research-swouf" title="Research">🔬</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
