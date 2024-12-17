/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthImport } from './routes/auth'
import { Route as AnalyticsImport } from './routes/analytics'
import { Route as AccountImport } from './routes/account'
import { Route as LandingImport } from './routes/_landing'
import { Route as PlayerIndexImport } from './routes/player/index'
import { Route as AnalyticsIndexImport } from './routes/analytics/index'
import { Route as AccountIndexImport } from './routes/account/index'
import { Route as EmailChangeImport } from './routes/email.change'
import { Route as AuthSuccessImport } from './routes/auth/success'
import { Route as AuthResetPasswordImport } from './routes/auth/reset-password'
import { Route as AuthRegisterImport } from './routes/auth/register'
import { Route as AuthLoginImport } from './routes/auth/login'
import { Route as AuthForgotPasswordImport } from './routes/auth/forgot-password'
import { Route as AccountStorageImport } from './routes/account/storage'
import { Route as AccountStatsImport } from './routes/account/stats'
import { Route as AccountSettingsImport } from './routes/account/settings'
import { Route as LandingTermsImport } from './routes/_landing/terms'
import { Route as LandingSupportImport } from './routes/_landing/support'
import { Route as LandingPolicyImport } from './routes/_landing/policy'
import { Route as LandingFeaturesImport } from './routes/_landing/features'
import { Route as LandingDisclaimerImport } from './routes/_landing/disclaimer'
import { Route as LandingContactUsImport } from './routes/_landing/contact-us'
import { Route as LandingAboutUsImport } from './routes/_landing/about-us'
import { Route as PlayerRootIdIndexImport } from './routes/player/$rootId/index'
import { Route as PlayerRootIdItemIdImport } from './routes/player/$rootId/$itemId'
import { Route as PlayerRootIdItemIdIndexImport } from './routes/player/$rootId/$itemId/index'
import { Route as AnalyticsItemsItemIdIndexImport } from './routes/analytics/items/$itemId/index'
import { Route as PlayerRootIdItemIdAutoLoginImport } from './routes/player/$rootId/$itemId/autoLogin'
import { Route as AnalyticsItemsItemIdUsersImport } from './routes/analytics/items/$itemId/users'
import { Route as AnalyticsItemsItemIdItemsImport } from './routes/analytics/items/$itemId/items'
import { Route as AnalyticsItemsItemIdExportImport } from './routes/analytics/items/$itemId/export'
import { Route as AnalyticsItemsItemIdAppsImport } from './routes/analytics/items/$itemId/apps'

// Create Virtual Routes

const LandingIndexLazyImport = createFileRoute('/_landing/')()
const AnalyticsItemsItemIdLazyImport = createFileRoute(
  '/analytics/items/$itemId',
)()

// Create/Update Routes

const AuthRoute = AuthImport.update({
  id: '/auth',
  path: '/auth',
  getParentRoute: () => rootRoute,
} as any)

const AnalyticsRoute = AnalyticsImport.update({
  id: '/analytics',
  path: '/analytics',
  getParentRoute: () => rootRoute,
} as any)

const AccountRoute = AccountImport.update({
  id: '/account',
  path: '/account',
  getParentRoute: () => rootRoute,
} as any)

const LandingRoute = LandingImport.update({
  id: '/_landing',
  getParentRoute: () => rootRoute,
} as any)

const LandingIndexLazyRoute = LandingIndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LandingRoute,
} as any).lazy(() =>
  import('./routes/_landing/index.lazy').then((d) => d.Route),
)

const PlayerIndexRoute = PlayerIndexImport.update({
  id: '/player/',
  path: '/player/',
  getParentRoute: () => rootRoute,
} as any)

const AnalyticsIndexRoute = AnalyticsIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AnalyticsRoute,
} as any)

const AccountIndexRoute = AccountIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AccountRoute,
} as any)

const EmailChangeRoute = EmailChangeImport.update({
  id: '/email/change',
  path: '/email/change',
  getParentRoute: () => rootRoute,
} as any)

const AuthSuccessRoute = AuthSuccessImport.update({
  id: '/success',
  path: '/success',
  getParentRoute: () => AuthRoute,
} as any)

const AuthResetPasswordRoute = AuthResetPasswordImport.update({
  id: '/reset-password',
  path: '/reset-password',
  getParentRoute: () => AuthRoute,
} as any)

const AuthRegisterRoute = AuthRegisterImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => AuthRoute,
} as any)

const AuthLoginRoute = AuthLoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => AuthRoute,
} as any)

const AuthForgotPasswordRoute = AuthForgotPasswordImport.update({
  id: '/forgot-password',
  path: '/forgot-password',
  getParentRoute: () => AuthRoute,
} as any)

const AccountStorageRoute = AccountStorageImport.update({
  id: '/storage',
  path: '/storage',
  getParentRoute: () => AccountRoute,
} as any)

const AccountStatsRoute = AccountStatsImport.update({
  id: '/stats',
  path: '/stats',
  getParentRoute: () => AccountRoute,
} as any)

const AccountSettingsRoute = AccountSettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => AccountRoute,
} as any)

const LandingTermsRoute = LandingTermsImport.update({
  id: '/terms',
  path: '/terms',
  getParentRoute: () => LandingRoute,
} as any)

const LandingSupportRoute = LandingSupportImport.update({
  id: '/support',
  path: '/support',
  getParentRoute: () => LandingRoute,
} as any)

const LandingPolicyRoute = LandingPolicyImport.update({
  id: '/policy',
  path: '/policy',
  getParentRoute: () => LandingRoute,
} as any)

const LandingFeaturesRoute = LandingFeaturesImport.update({
  id: '/features',
  path: '/features',
  getParentRoute: () => LandingRoute,
} as any)

const LandingDisclaimerRoute = LandingDisclaimerImport.update({
  id: '/disclaimer',
  path: '/disclaimer',
  getParentRoute: () => LandingRoute,
} as any)

const LandingContactUsRoute = LandingContactUsImport.update({
  id: '/contact-us',
  path: '/contact-us',
  getParentRoute: () => LandingRoute,
} as any)

const LandingAboutUsRoute = LandingAboutUsImport.update({
  id: '/about-us',
  path: '/about-us',
  getParentRoute: () => LandingRoute,
} as any)

const PlayerRootIdIndexRoute = PlayerRootIdIndexImport.update({
  id: '/player/$rootId/',
  path: '/player/$rootId/',
  getParentRoute: () => rootRoute,
} as any)

const AnalyticsItemsItemIdLazyRoute = AnalyticsItemsItemIdLazyImport.update({
  id: '/items/$itemId',
  path: '/items/$itemId',
  getParentRoute: () => AnalyticsRoute,
} as any).lazy(() =>
  import('./routes/analytics/items/$itemId.lazy').then((d) => d.Route),
)

const PlayerRootIdItemIdRoute = PlayerRootIdItemIdImport.update({
  id: '/player/$rootId/$itemId',
  path: '/player/$rootId/$itemId',
  getParentRoute: () => rootRoute,
} as any)

const PlayerRootIdItemIdIndexRoute = PlayerRootIdItemIdIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => PlayerRootIdItemIdRoute,
} as any)

const AnalyticsItemsItemIdIndexRoute = AnalyticsItemsItemIdIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AnalyticsItemsItemIdLazyRoute,
} as any)

const PlayerRootIdItemIdAutoLoginRoute =
  PlayerRootIdItemIdAutoLoginImport.update({
    id: '/autoLogin',
    path: '/autoLogin',
    getParentRoute: () => PlayerRootIdItemIdRoute,
  } as any)

const AnalyticsItemsItemIdUsersRoute = AnalyticsItemsItemIdUsersImport.update({
  id: '/users',
  path: '/users',
  getParentRoute: () => AnalyticsItemsItemIdLazyRoute,
} as any)

const AnalyticsItemsItemIdItemsRoute = AnalyticsItemsItemIdItemsImport.update({
  id: '/items',
  path: '/items',
  getParentRoute: () => AnalyticsItemsItemIdLazyRoute,
} as any)

const AnalyticsItemsItemIdExportRoute = AnalyticsItemsItemIdExportImport.update(
  {
    id: '/export',
    path: '/export',
    getParentRoute: () => AnalyticsItemsItemIdLazyRoute,
  } as any,
)

const AnalyticsItemsItemIdAppsRoute = AnalyticsItemsItemIdAppsImport.update({
  id: '/apps',
  path: '/apps',
  getParentRoute: () => AnalyticsItemsItemIdLazyRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_landing': {
      id: '/_landing'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LandingImport
      parentRoute: typeof rootRoute
    }
    '/account': {
      id: '/account'
      path: '/account'
      fullPath: '/account'
      preLoaderRoute: typeof AccountImport
      parentRoute: typeof rootRoute
    }
    '/analytics': {
      id: '/analytics'
      path: '/analytics'
      fullPath: '/analytics'
      preLoaderRoute: typeof AnalyticsImport
      parentRoute: typeof rootRoute
    }
    '/auth': {
      id: '/auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/_landing/about-us': {
      id: '/_landing/about-us'
      path: '/about-us'
      fullPath: '/about-us'
      preLoaderRoute: typeof LandingAboutUsImport
      parentRoute: typeof LandingImport
    }
    '/_landing/contact-us': {
      id: '/_landing/contact-us'
      path: '/contact-us'
      fullPath: '/contact-us'
      preLoaderRoute: typeof LandingContactUsImport
      parentRoute: typeof LandingImport
    }
    '/_landing/disclaimer': {
      id: '/_landing/disclaimer'
      path: '/disclaimer'
      fullPath: '/disclaimer'
      preLoaderRoute: typeof LandingDisclaimerImport
      parentRoute: typeof LandingImport
    }
    '/_landing/features': {
      id: '/_landing/features'
      path: '/features'
      fullPath: '/features'
      preLoaderRoute: typeof LandingFeaturesImport
      parentRoute: typeof LandingImport
    }
    '/_landing/policy': {
      id: '/_landing/policy'
      path: '/policy'
      fullPath: '/policy'
      preLoaderRoute: typeof LandingPolicyImport
      parentRoute: typeof LandingImport
    }
    '/_landing/support': {
      id: '/_landing/support'
      path: '/support'
      fullPath: '/support'
      preLoaderRoute: typeof LandingSupportImport
      parentRoute: typeof LandingImport
    }
    '/_landing/terms': {
      id: '/_landing/terms'
      path: '/terms'
      fullPath: '/terms'
      preLoaderRoute: typeof LandingTermsImport
      parentRoute: typeof LandingImport
    }
    '/account/settings': {
      id: '/account/settings'
      path: '/settings'
      fullPath: '/account/settings'
      preLoaderRoute: typeof AccountSettingsImport
      parentRoute: typeof AccountImport
    }
    '/account/stats': {
      id: '/account/stats'
      path: '/stats'
      fullPath: '/account/stats'
      preLoaderRoute: typeof AccountStatsImport
      parentRoute: typeof AccountImport
    }
    '/account/storage': {
      id: '/account/storage'
      path: '/storage'
      fullPath: '/account/storage'
      preLoaderRoute: typeof AccountStorageImport
      parentRoute: typeof AccountImport
    }
    '/auth/forgot-password': {
      id: '/auth/forgot-password'
      path: '/forgot-password'
      fullPath: '/auth/forgot-password'
      preLoaderRoute: typeof AuthForgotPasswordImport
      parentRoute: typeof AuthImport
    }
    '/auth/login': {
      id: '/auth/login'
      path: '/login'
      fullPath: '/auth/login'
      preLoaderRoute: typeof AuthLoginImport
      parentRoute: typeof AuthImport
    }
    '/auth/register': {
      id: '/auth/register'
      path: '/register'
      fullPath: '/auth/register'
      preLoaderRoute: typeof AuthRegisterImport
      parentRoute: typeof AuthImport
    }
    '/auth/reset-password': {
      id: '/auth/reset-password'
      path: '/reset-password'
      fullPath: '/auth/reset-password'
      preLoaderRoute: typeof AuthResetPasswordImport
      parentRoute: typeof AuthImport
    }
    '/auth/success': {
      id: '/auth/success'
      path: '/success'
      fullPath: '/auth/success'
      preLoaderRoute: typeof AuthSuccessImport
      parentRoute: typeof AuthImport
    }
    '/email/change': {
      id: '/email/change'
      path: '/email/change'
      fullPath: '/email/change'
      preLoaderRoute: typeof EmailChangeImport
      parentRoute: typeof rootRoute
    }
    '/account/': {
      id: '/account/'
      path: '/'
      fullPath: '/account/'
      preLoaderRoute: typeof AccountIndexImport
      parentRoute: typeof AccountImport
    }
    '/analytics/': {
      id: '/analytics/'
      path: '/'
      fullPath: '/analytics/'
      preLoaderRoute: typeof AnalyticsIndexImport
      parentRoute: typeof AnalyticsImport
    }
    '/player/': {
      id: '/player/'
      path: '/player'
      fullPath: '/player'
      preLoaderRoute: typeof PlayerIndexImport
      parentRoute: typeof rootRoute
    }
    '/_landing/': {
      id: '/_landing/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof LandingIndexLazyImport
      parentRoute: typeof LandingImport
    }
    '/player/$rootId/$itemId': {
      id: '/player/$rootId/$itemId'
      path: '/player/$rootId/$itemId'
      fullPath: '/player/$rootId/$itemId'
      preLoaderRoute: typeof PlayerRootIdItemIdImport
      parentRoute: typeof rootRoute
    }
    '/analytics/items/$itemId': {
      id: '/analytics/items/$itemId'
      path: '/items/$itemId'
      fullPath: '/analytics/items/$itemId'
      preLoaderRoute: typeof AnalyticsItemsItemIdLazyImport
      parentRoute: typeof AnalyticsImport
    }
    '/player/$rootId/': {
      id: '/player/$rootId/'
      path: '/player/$rootId'
      fullPath: '/player/$rootId'
      preLoaderRoute: typeof PlayerRootIdIndexImport
      parentRoute: typeof rootRoute
    }
    '/analytics/items/$itemId/apps': {
      id: '/analytics/items/$itemId/apps'
      path: '/apps'
      fullPath: '/analytics/items/$itemId/apps'
      preLoaderRoute: typeof AnalyticsItemsItemIdAppsImport
      parentRoute: typeof AnalyticsItemsItemIdLazyImport
    }
    '/analytics/items/$itemId/export': {
      id: '/analytics/items/$itemId/export'
      path: '/export'
      fullPath: '/analytics/items/$itemId/export'
      preLoaderRoute: typeof AnalyticsItemsItemIdExportImport
      parentRoute: typeof AnalyticsItemsItemIdLazyImport
    }
    '/analytics/items/$itemId/items': {
      id: '/analytics/items/$itemId/items'
      path: '/items'
      fullPath: '/analytics/items/$itemId/items'
      preLoaderRoute: typeof AnalyticsItemsItemIdItemsImport
      parentRoute: typeof AnalyticsItemsItemIdLazyImport
    }
    '/analytics/items/$itemId/users': {
      id: '/analytics/items/$itemId/users'
      path: '/users'
      fullPath: '/analytics/items/$itemId/users'
      preLoaderRoute: typeof AnalyticsItemsItemIdUsersImport
      parentRoute: typeof AnalyticsItemsItemIdLazyImport
    }
    '/player/$rootId/$itemId/autoLogin': {
      id: '/player/$rootId/$itemId/autoLogin'
      path: '/autoLogin'
      fullPath: '/player/$rootId/$itemId/autoLogin'
      preLoaderRoute: typeof PlayerRootIdItemIdAutoLoginImport
      parentRoute: typeof PlayerRootIdItemIdImport
    }
    '/analytics/items/$itemId/': {
      id: '/analytics/items/$itemId/'
      path: '/'
      fullPath: '/analytics/items/$itemId/'
      preLoaderRoute: typeof AnalyticsItemsItemIdIndexImport
      parentRoute: typeof AnalyticsItemsItemIdLazyImport
    }
    '/player/$rootId/$itemId/': {
      id: '/player/$rootId/$itemId/'
      path: '/'
      fullPath: '/player/$rootId/$itemId/'
      preLoaderRoute: typeof PlayerRootIdItemIdIndexImport
      parentRoute: typeof PlayerRootIdItemIdImport
    }
  }
}

// Create and export the route tree

interface LandingRouteChildren {
  LandingAboutUsRoute: typeof LandingAboutUsRoute
  LandingContactUsRoute: typeof LandingContactUsRoute
  LandingDisclaimerRoute: typeof LandingDisclaimerRoute
  LandingFeaturesRoute: typeof LandingFeaturesRoute
  LandingPolicyRoute: typeof LandingPolicyRoute
  LandingSupportRoute: typeof LandingSupportRoute
  LandingTermsRoute: typeof LandingTermsRoute
  LandingIndexLazyRoute: typeof LandingIndexLazyRoute
}

const LandingRouteChildren: LandingRouteChildren = {
  LandingAboutUsRoute: LandingAboutUsRoute,
  LandingContactUsRoute: LandingContactUsRoute,
  LandingDisclaimerRoute: LandingDisclaimerRoute,
  LandingFeaturesRoute: LandingFeaturesRoute,
  LandingPolicyRoute: LandingPolicyRoute,
  LandingSupportRoute: LandingSupportRoute,
  LandingTermsRoute: LandingTermsRoute,
  LandingIndexLazyRoute: LandingIndexLazyRoute,
}

const LandingRouteWithChildren =
  LandingRoute._addFileChildren(LandingRouteChildren)

interface AccountRouteChildren {
  AccountSettingsRoute: typeof AccountSettingsRoute
  AccountStatsRoute: typeof AccountStatsRoute
  AccountStorageRoute: typeof AccountStorageRoute
  AccountIndexRoute: typeof AccountIndexRoute
}

const AccountRouteChildren: AccountRouteChildren = {
  AccountSettingsRoute: AccountSettingsRoute,
  AccountStatsRoute: AccountStatsRoute,
  AccountStorageRoute: AccountStorageRoute,
  AccountIndexRoute: AccountIndexRoute,
}

const AccountRouteWithChildren =
  AccountRoute._addFileChildren(AccountRouteChildren)

interface AnalyticsItemsItemIdLazyRouteChildren {
  AnalyticsItemsItemIdAppsRoute: typeof AnalyticsItemsItemIdAppsRoute
  AnalyticsItemsItemIdExportRoute: typeof AnalyticsItemsItemIdExportRoute
  AnalyticsItemsItemIdItemsRoute: typeof AnalyticsItemsItemIdItemsRoute
  AnalyticsItemsItemIdUsersRoute: typeof AnalyticsItemsItemIdUsersRoute
  AnalyticsItemsItemIdIndexRoute: typeof AnalyticsItemsItemIdIndexRoute
}

const AnalyticsItemsItemIdLazyRouteChildren: AnalyticsItemsItemIdLazyRouteChildren =
  {
    AnalyticsItemsItemIdAppsRoute: AnalyticsItemsItemIdAppsRoute,
    AnalyticsItemsItemIdExportRoute: AnalyticsItemsItemIdExportRoute,
    AnalyticsItemsItemIdItemsRoute: AnalyticsItemsItemIdItemsRoute,
    AnalyticsItemsItemIdUsersRoute: AnalyticsItemsItemIdUsersRoute,
    AnalyticsItemsItemIdIndexRoute: AnalyticsItemsItemIdIndexRoute,
  }

const AnalyticsItemsItemIdLazyRouteWithChildren =
  AnalyticsItemsItemIdLazyRoute._addFileChildren(
    AnalyticsItemsItemIdLazyRouteChildren,
  )

interface AnalyticsRouteChildren {
  AnalyticsIndexRoute: typeof AnalyticsIndexRoute
  AnalyticsItemsItemIdLazyRoute: typeof AnalyticsItemsItemIdLazyRouteWithChildren
}

const AnalyticsRouteChildren: AnalyticsRouteChildren = {
  AnalyticsIndexRoute: AnalyticsIndexRoute,
  AnalyticsItemsItemIdLazyRoute: AnalyticsItemsItemIdLazyRouteWithChildren,
}

const AnalyticsRouteWithChildren = AnalyticsRoute._addFileChildren(
  AnalyticsRouteChildren,
)

interface AuthRouteChildren {
  AuthForgotPasswordRoute: typeof AuthForgotPasswordRoute
  AuthLoginRoute: typeof AuthLoginRoute
  AuthRegisterRoute: typeof AuthRegisterRoute
  AuthResetPasswordRoute: typeof AuthResetPasswordRoute
  AuthSuccessRoute: typeof AuthSuccessRoute
}

const AuthRouteChildren: AuthRouteChildren = {
  AuthForgotPasswordRoute: AuthForgotPasswordRoute,
  AuthLoginRoute: AuthLoginRoute,
  AuthRegisterRoute: AuthRegisterRoute,
  AuthResetPasswordRoute: AuthResetPasswordRoute,
  AuthSuccessRoute: AuthSuccessRoute,
}

const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren)

interface PlayerRootIdItemIdRouteChildren {
  PlayerRootIdItemIdAutoLoginRoute: typeof PlayerRootIdItemIdAutoLoginRoute
  PlayerRootIdItemIdIndexRoute: typeof PlayerRootIdItemIdIndexRoute
}

const PlayerRootIdItemIdRouteChildren: PlayerRootIdItemIdRouteChildren = {
  PlayerRootIdItemIdAutoLoginRoute: PlayerRootIdItemIdAutoLoginRoute,
  PlayerRootIdItemIdIndexRoute: PlayerRootIdItemIdIndexRoute,
}

const PlayerRootIdItemIdRouteWithChildren =
  PlayerRootIdItemIdRoute._addFileChildren(PlayerRootIdItemIdRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof LandingRouteWithChildren
  '/account': typeof AccountRouteWithChildren
  '/analytics': typeof AnalyticsRouteWithChildren
  '/auth': typeof AuthRouteWithChildren
  '/about-us': typeof LandingAboutUsRoute
  '/contact-us': typeof LandingContactUsRoute
  '/disclaimer': typeof LandingDisclaimerRoute
  '/features': typeof LandingFeaturesRoute
  '/policy': typeof LandingPolicyRoute
  '/support': typeof LandingSupportRoute
  '/terms': typeof LandingTermsRoute
  '/account/settings': typeof AccountSettingsRoute
  '/account/stats': typeof AccountStatsRoute
  '/account/storage': typeof AccountStorageRoute
  '/auth/forgot-password': typeof AuthForgotPasswordRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/register': typeof AuthRegisterRoute
  '/auth/reset-password': typeof AuthResetPasswordRoute
  '/auth/success': typeof AuthSuccessRoute
  '/email/change': typeof EmailChangeRoute
  '/account/': typeof AccountIndexRoute
  '/analytics/': typeof AnalyticsIndexRoute
  '/player': typeof PlayerIndexRoute
  '/': typeof LandingIndexLazyRoute
  '/player/$rootId/$itemId': typeof PlayerRootIdItemIdRouteWithChildren
  '/analytics/items/$itemId': typeof AnalyticsItemsItemIdLazyRouteWithChildren
  '/player/$rootId': typeof PlayerRootIdIndexRoute
  '/analytics/items/$itemId/apps': typeof AnalyticsItemsItemIdAppsRoute
  '/analytics/items/$itemId/export': typeof AnalyticsItemsItemIdExportRoute
  '/analytics/items/$itemId/items': typeof AnalyticsItemsItemIdItemsRoute
  '/analytics/items/$itemId/users': typeof AnalyticsItemsItemIdUsersRoute
  '/player/$rootId/$itemId/autoLogin': typeof PlayerRootIdItemIdAutoLoginRoute
  '/analytics/items/$itemId/': typeof AnalyticsItemsItemIdIndexRoute
  '/player/$rootId/$itemId/': typeof PlayerRootIdItemIdIndexRoute
}

export interface FileRoutesByTo {
  '/auth': typeof AuthRouteWithChildren
  '/about-us': typeof LandingAboutUsRoute
  '/contact-us': typeof LandingContactUsRoute
  '/disclaimer': typeof LandingDisclaimerRoute
  '/features': typeof LandingFeaturesRoute
  '/policy': typeof LandingPolicyRoute
  '/support': typeof LandingSupportRoute
  '/terms': typeof LandingTermsRoute
  '/account/settings': typeof AccountSettingsRoute
  '/account/stats': typeof AccountStatsRoute
  '/account/storage': typeof AccountStorageRoute
  '/auth/forgot-password': typeof AuthForgotPasswordRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/register': typeof AuthRegisterRoute
  '/auth/reset-password': typeof AuthResetPasswordRoute
  '/auth/success': typeof AuthSuccessRoute
  '/email/change': typeof EmailChangeRoute
  '/account': typeof AccountIndexRoute
  '/analytics': typeof AnalyticsIndexRoute
  '/player': typeof PlayerIndexRoute
  '/': typeof LandingIndexLazyRoute
  '/player/$rootId': typeof PlayerRootIdIndexRoute
  '/analytics/items/$itemId/apps': typeof AnalyticsItemsItemIdAppsRoute
  '/analytics/items/$itemId/export': typeof AnalyticsItemsItemIdExportRoute
  '/analytics/items/$itemId/items': typeof AnalyticsItemsItemIdItemsRoute
  '/analytics/items/$itemId/users': typeof AnalyticsItemsItemIdUsersRoute
  '/player/$rootId/$itemId/autoLogin': typeof PlayerRootIdItemIdAutoLoginRoute
  '/analytics/items/$itemId': typeof AnalyticsItemsItemIdIndexRoute
  '/player/$rootId/$itemId': typeof PlayerRootIdItemIdIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_landing': typeof LandingRouteWithChildren
  '/account': typeof AccountRouteWithChildren
  '/analytics': typeof AnalyticsRouteWithChildren
  '/auth': typeof AuthRouteWithChildren
  '/_landing/about-us': typeof LandingAboutUsRoute
  '/_landing/contact-us': typeof LandingContactUsRoute
  '/_landing/disclaimer': typeof LandingDisclaimerRoute
  '/_landing/features': typeof LandingFeaturesRoute
  '/_landing/policy': typeof LandingPolicyRoute
  '/_landing/support': typeof LandingSupportRoute
  '/_landing/terms': typeof LandingTermsRoute
  '/account/settings': typeof AccountSettingsRoute
  '/account/stats': typeof AccountStatsRoute
  '/account/storage': typeof AccountStorageRoute
  '/auth/forgot-password': typeof AuthForgotPasswordRoute
  '/auth/login': typeof AuthLoginRoute
  '/auth/register': typeof AuthRegisterRoute
  '/auth/reset-password': typeof AuthResetPasswordRoute
  '/auth/success': typeof AuthSuccessRoute
  '/email/change': typeof EmailChangeRoute
  '/account/': typeof AccountIndexRoute
  '/analytics/': typeof AnalyticsIndexRoute
  '/player/': typeof PlayerIndexRoute
  '/_landing/': typeof LandingIndexLazyRoute
  '/player/$rootId/$itemId': typeof PlayerRootIdItemIdRouteWithChildren
  '/analytics/items/$itemId': typeof AnalyticsItemsItemIdLazyRouteWithChildren
  '/player/$rootId/': typeof PlayerRootIdIndexRoute
  '/analytics/items/$itemId/apps': typeof AnalyticsItemsItemIdAppsRoute
  '/analytics/items/$itemId/export': typeof AnalyticsItemsItemIdExportRoute
  '/analytics/items/$itemId/items': typeof AnalyticsItemsItemIdItemsRoute
  '/analytics/items/$itemId/users': typeof AnalyticsItemsItemIdUsersRoute
  '/player/$rootId/$itemId/autoLogin': typeof PlayerRootIdItemIdAutoLoginRoute
  '/analytics/items/$itemId/': typeof AnalyticsItemsItemIdIndexRoute
  '/player/$rootId/$itemId/': typeof PlayerRootIdItemIdIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/account'
    | '/analytics'
    | '/auth'
    | '/about-us'
    | '/contact-us'
    | '/disclaimer'
    | '/features'
    | '/policy'
    | '/support'
    | '/terms'
    | '/account/settings'
    | '/account/stats'
    | '/account/storage'
    | '/auth/forgot-password'
    | '/auth/login'
    | '/auth/register'
    | '/auth/reset-password'
    | '/auth/success'
    | '/email/change'
    | '/account/'
    | '/analytics/'
    | '/player'
    | '/'
    | '/player/$rootId/$itemId'
    | '/analytics/items/$itemId'
    | '/player/$rootId'
    | '/analytics/items/$itemId/apps'
    | '/analytics/items/$itemId/export'
    | '/analytics/items/$itemId/items'
    | '/analytics/items/$itemId/users'
    | '/player/$rootId/$itemId/autoLogin'
    | '/analytics/items/$itemId/'
    | '/player/$rootId/$itemId/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/auth'
    | '/about-us'
    | '/contact-us'
    | '/disclaimer'
    | '/features'
    | '/policy'
    | '/support'
    | '/terms'
    | '/account/settings'
    | '/account/stats'
    | '/account/storage'
    | '/auth/forgot-password'
    | '/auth/login'
    | '/auth/register'
    | '/auth/reset-password'
    | '/auth/success'
    | '/email/change'
    | '/account'
    | '/analytics'
    | '/player'
    | '/'
    | '/player/$rootId'
    | '/analytics/items/$itemId/apps'
    | '/analytics/items/$itemId/export'
    | '/analytics/items/$itemId/items'
    | '/analytics/items/$itemId/users'
    | '/player/$rootId/$itemId/autoLogin'
    | '/analytics/items/$itemId'
    | '/player/$rootId/$itemId'
  id:
    | '__root__'
    | '/_landing'
    | '/account'
    | '/analytics'
    | '/auth'
    | '/_landing/about-us'
    | '/_landing/contact-us'
    | '/_landing/disclaimer'
    | '/_landing/features'
    | '/_landing/policy'
    | '/_landing/support'
    | '/_landing/terms'
    | '/account/settings'
    | '/account/stats'
    | '/account/storage'
    | '/auth/forgot-password'
    | '/auth/login'
    | '/auth/register'
    | '/auth/reset-password'
    | '/auth/success'
    | '/email/change'
    | '/account/'
    | '/analytics/'
    | '/player/'
    | '/_landing/'
    | '/player/$rootId/$itemId'
    | '/analytics/items/$itemId'
    | '/player/$rootId/'
    | '/analytics/items/$itemId/apps'
    | '/analytics/items/$itemId/export'
    | '/analytics/items/$itemId/items'
    | '/analytics/items/$itemId/users'
    | '/player/$rootId/$itemId/autoLogin'
    | '/analytics/items/$itemId/'
    | '/player/$rootId/$itemId/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  LandingRoute: typeof LandingRouteWithChildren
  AccountRoute: typeof AccountRouteWithChildren
  AnalyticsRoute: typeof AnalyticsRouteWithChildren
  AuthRoute: typeof AuthRouteWithChildren
  EmailChangeRoute: typeof EmailChangeRoute
  PlayerIndexRoute: typeof PlayerIndexRoute
  PlayerRootIdItemIdRoute: typeof PlayerRootIdItemIdRouteWithChildren
  PlayerRootIdIndexRoute: typeof PlayerRootIdIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  LandingRoute: LandingRouteWithChildren,
  AccountRoute: AccountRouteWithChildren,
  AnalyticsRoute: AnalyticsRouteWithChildren,
  AuthRoute: AuthRouteWithChildren,
  EmailChangeRoute: EmailChangeRoute,
  PlayerIndexRoute: PlayerIndexRoute,
  PlayerRootIdItemIdRoute: PlayerRootIdItemIdRouteWithChildren,
  PlayerRootIdIndexRoute: PlayerRootIdIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_landing",
        "/account",
        "/analytics",
        "/auth",
        "/email/change",
        "/player/",
        "/player/$rootId/$itemId",
        "/player/$rootId/"
      ]
    },
    "/_landing": {
      "filePath": "_landing.tsx",
      "children": [
        "/_landing/about-us",
        "/_landing/contact-us",
        "/_landing/disclaimer",
        "/_landing/features",
        "/_landing/policy",
        "/_landing/support",
        "/_landing/terms",
        "/_landing/"
      ]
    },
    "/account": {
      "filePath": "account.tsx",
      "children": [
        "/account/settings",
        "/account/stats",
        "/account/storage",
        "/account/"
      ]
    },
    "/analytics": {
      "filePath": "analytics.tsx",
      "children": [
        "/analytics/",
        "/analytics/items/$itemId"
      ]
    },
    "/auth": {
      "filePath": "auth.tsx",
      "children": [
        "/auth/forgot-password",
        "/auth/login",
        "/auth/register",
        "/auth/reset-password",
        "/auth/success"
      ]
    },
    "/_landing/about-us": {
      "filePath": "_landing/about-us.tsx",
      "parent": "/_landing"
    },
    "/_landing/contact-us": {
      "filePath": "_landing/contact-us.tsx",
      "parent": "/_landing"
    },
    "/_landing/disclaimer": {
      "filePath": "_landing/disclaimer.tsx",
      "parent": "/_landing"
    },
    "/_landing/features": {
      "filePath": "_landing/features.tsx",
      "parent": "/_landing"
    },
    "/_landing/policy": {
      "filePath": "_landing/policy.tsx",
      "parent": "/_landing"
    },
    "/_landing/support": {
      "filePath": "_landing/support.tsx",
      "parent": "/_landing"
    },
    "/_landing/terms": {
      "filePath": "_landing/terms.tsx",
      "parent": "/_landing"
    },
    "/account/settings": {
      "filePath": "account/settings.tsx",
      "parent": "/account"
    },
    "/account/stats": {
      "filePath": "account/stats.tsx",
      "parent": "/account"
    },
    "/account/storage": {
      "filePath": "account/storage.tsx",
      "parent": "/account"
    },
    "/auth/forgot-password": {
      "filePath": "auth/forgot-password.tsx",
      "parent": "/auth"
    },
    "/auth/login": {
      "filePath": "auth/login.tsx",
      "parent": "/auth"
    },
    "/auth/register": {
      "filePath": "auth/register.tsx",
      "parent": "/auth"
    },
    "/auth/reset-password": {
      "filePath": "auth/reset-password.tsx",
      "parent": "/auth"
    },
    "/auth/success": {
      "filePath": "auth/success.tsx",
      "parent": "/auth"
    },
    "/email/change": {
      "filePath": "email.change.tsx"
    },
    "/account/": {
      "filePath": "account/index.tsx",
      "parent": "/account"
    },
    "/analytics/": {
      "filePath": "analytics/index.tsx",
      "parent": "/analytics"
    },
    "/player/": {
      "filePath": "player/index.tsx"
    },
    "/_landing/": {
      "filePath": "_landing/index.lazy.tsx",
      "parent": "/_landing"
    },
    "/player/$rootId/$itemId": {
      "filePath": "player/$rootId/$itemId.tsx",
      "children": [
        "/player/$rootId/$itemId/autoLogin",
        "/player/$rootId/$itemId/"
      ]
    },
    "/analytics/items/$itemId": {
      "filePath": "analytics/items/$itemId.lazy.tsx",
      "parent": "/analytics",
      "children": [
        "/analytics/items/$itemId/apps",
        "/analytics/items/$itemId/export",
        "/analytics/items/$itemId/items",
        "/analytics/items/$itemId/users",
        "/analytics/items/$itemId/"
      ]
    },
    "/player/$rootId/": {
      "filePath": "player/$rootId/index.tsx"
    },
    "/analytics/items/$itemId/apps": {
      "filePath": "analytics/items/$itemId/apps.tsx",
      "parent": "/analytics/items/$itemId"
    },
    "/analytics/items/$itemId/export": {
      "filePath": "analytics/items/$itemId/export.tsx",
      "parent": "/analytics/items/$itemId"
    },
    "/analytics/items/$itemId/items": {
      "filePath": "analytics/items/$itemId/items.tsx",
      "parent": "/analytics/items/$itemId"
    },
    "/analytics/items/$itemId/users": {
      "filePath": "analytics/items/$itemId/users.tsx",
      "parent": "/analytics/items/$itemId"
    },
    "/player/$rootId/$itemId/autoLogin": {
      "filePath": "player/$rootId/$itemId/autoLogin.tsx",
      "parent": "/player/$rootId/$itemId"
    },
    "/analytics/items/$itemId/": {
      "filePath": "analytics/items/$itemId/index.tsx",
      "parent": "/analytics/items/$itemId"
    },
    "/player/$rootId/$itemId/": {
      "filePath": "player/$rootId/$itemId/index.tsx",
      "parent": "/player/$rootId/$itemId"
    }
  }
}
ROUTE_MANIFEST_END */
