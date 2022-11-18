interface WebClipperConfig {
  icon: string;
  iconDark: string;
  oneNoteCallBack: string;
  oneNoteClientId: string;
  createLogger: boolean;
  serverHost: string;
  resourceHost: string;
  loadRemoteConfig: boolean;
  googleOauth: {
    clientId: string;
    callback: string;
  };
}

let config: WebClipperConfig = {
  googleOauth: {
    clientId: '269705697424-vlu486hs2paqj71p9defgvkbrpo9amcq.apps.googleusercontent.com',
    callback: 'https://api.clipper.website/api/user/oauth/google',
  },
  icon: 'icon.png',
  iconDark: 'icon-dark.png',
  oneNoteClientId: '563571ad-cfcd-442a-aa34-046bad24b1b6',
  oneNoteCallBack: 'https://webclipper-oauth.yfd.im/onenote_oauth',
  createLogger: false,
  // oneNoteCallBack: 'http://localhost:3000/onenote_oauth',
  serverHost: 'https://api.clipper.website',
  resourceHost: 'https://resource.clipper.website',
  loadRemoteConfig: true,
};

if (process.env.NODE_ENV === 'development') {
  config = Object.assign({}, config, {
    googleOauth: {
      clientId: '269705697424-l6h6e3pkcsjs3lggjdlivs7vaarr8gp0.apps.googleusercontent.com',
      callback: 'https://api.test.clipper.website/api/user/oauth/google',
      // callback: 'http://localhost:3000/api/user/oauth/google', // Local test
    },
    loadRemoteConfig: true,
    icon: 'icon-dev.png',
    oneNoteClientId: '01c7500b-98dd-4f37-813f-a959382793ac',
    oneNoteCallBack: 'https://webclipper-oauth.test.yfd.im/onenote_oauth',
    // oneNoteCallBack: 'http://localhost:3000/onenote_oauth',
    createLogger: false
  });
}

export default config;
