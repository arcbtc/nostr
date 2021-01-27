import {LocalStorage} from 'quasar'

export default function () {
  return {
    myProfile: LocalStorage.getItem('myProfile'),
    theirProfile: LocalStorage.getItem('theirProfile') || [],

    kind1: LocalStorage.getItem('kind1') || [],
    messages: {}
  }
}
