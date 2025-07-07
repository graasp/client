import createRoutine from './utils.js';

export const signOutRoutine = createRoutine('SIGN_OUT');
export const createPasswordResetRequestRoutine = createRoutine(
  'CREATE_PASSWORD_RESET_REQUEST',
);
export const resolvePasswordResetRequestRoutine = createRoutine(
  'RESOLVE_PASSWORD_RESET_REQUEST',
);
