import { AccountPreference } from './modelTypes/account';

export function unpackAccountPreference(account: AccountPreference) {
  const {
    id,
    type,
    defaultRepositoryId,
    name,
    avatar,
    description,
    homePage,
    ...info
  } = account;
  return {
    id,
    account: {
      type,
      defaultRepositoryId,
      info,
    },
    userInfo: {
      name,
      avatar,
      description,
      homePage,
    },
  };
}
