/**
 * Blockstack compatibility stubs.
 * The legacy blockstack SDK blocked dependency upgrades and is unmaintained.
 * Portfolio data continues to use localStorage (keys unchanged).
 * The /blockstack route still renders UI, but auth/Gaia are no-ops.
 */

export const isBlockstackAvailable = () => false;

export const isUserSignedIn = () => false;
export const isSignInPending = () => false;
export const redirectToSignIn = () => {
  console.info('Blockstack sign-in is no longer available in this build.');
};
export const handlePendingSignIn = () => Promise.resolve(null);
export const signUserOut = () => {};
export const putFile = () => Promise.resolve();
export const getFile = () => Promise.resolve(null);
export const loadUserData = () => ({ profile: {} });

export class Person {
  name() {
    return 'Anon';
  }
}

const blockstackCompat = {
  isUserSignedIn,
  isSignInPending,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut,
  putFile,
  getFile,
  loadUserData,
  Person,
};

export default blockstackCompat;
