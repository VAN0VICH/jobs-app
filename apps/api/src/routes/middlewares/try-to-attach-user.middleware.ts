import { AppKoaContext, Next } from 'types';

const tryToAttachUser = async (_: AppKoaContext, next: Next) => next();

export default tryToAttachUser;
