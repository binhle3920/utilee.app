export const parseFirebaseRegisterErrorCode = (code?: string) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email already in use';
    case 'auth/invalid-email':
      return 'Invalid email';
    case 'auth/weak-password':
      return 'Weak password';
    default:
      console.log('[ERROR] Firebase Register Error Code:', code);
      return 'Failed to create account, please try again';
  }
};

export const parseFirebaseLoginErrorCode = (code?: string) => {
  switch (code) {
    case 'auth/user-not-found':
      return 'User not found';
    case 'auth/wrong-password':
      return 'Wrong password';
    case 'auth/invalid-credential':
      return 'Email or password is invalid, please try again';
    default:
      console.log('[ERROR] Firebase Login Error Code:', code);
      return 'Failed to login, please try again';
  }
};
