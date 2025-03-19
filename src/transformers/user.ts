import { RawUserResponse, UserResponse } from "../types/user";

export const UserTransformer = (raw: RawUserResponse) => {
  const {
    user: {
      $: { id, name, termsofuse },
      firstname,
      lastname,
      avatarlink,
      yearregistered,
      lastlogin,
      stateorprovince,
      country,
      webaddress,
      xboxaccount,
      wiiaccount,
      psnaccount,
      battlenetaccount,
      steamaccount,
      traderating,
    },
  } = raw;

  const res: UserResponse = {
    termsOfUse: termsofuse,
    id,
    username: name,
    firstName: firstname?.value,
    lastName: lastname?.value,
    avatarLink: avatarlink?.value,
    yearRegistered: yearregistered?.value,
    lastLogin: lastlogin?.value? new Date(lastlogin?.value) : undefined,
    stateOrProvince: stateorprovince?.value,
    country: country?.value,
    webAddress: webaddress?.value,
    xboxAccount: xboxaccount?.value,
    wiiAccount: wiiaccount?.value,
    psnAccount: psnaccount?.value,
    battleNetAccount: battlenetaccount?.value,
    steamAccount: steamaccount?.value,
    tradeRating: traderating?.value,
  };

  for (const key of Object.keys(res)) {
    const k = key as keyof typeof res;
    if (res[k] === undefined) {
      delete res[k];
    }
  }

  return res;
};
