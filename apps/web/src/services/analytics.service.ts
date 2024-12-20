import mixpanel from 'mixpanel-browser';

import config from 'config';

export const init = () => {
  mixpanel.init(config.MIXPANEL_API_KEY ?? '', { debug: config.IS_DEV });
};

export const track = (event: string, data = {}) => {
  try {
    mixpanel.track(event, data);
  } catch (e) {
    console.error(e);
  }
};
