import willy from '../functions/functions';

export default async ({ Vue }) => {
  Vue.prototype.$willy = willy;
};