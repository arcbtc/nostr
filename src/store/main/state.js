import {LocalStorage} from 'quasar'

export default function () {
  return {
    myProfile: LocalStorage.getItem('myProfile'),
    theirProfile: LocalStorage.getItem('theirProfile') || [],
    kind1: LocalStorage.getItem('kind1') || [],
    kind2: LocalStorage.getItem('kind2') || [],
    kind3: LocalStorage.getItem('kind3') || [],
    kind4: LocalStorage.getItem('kind4') || []
  }
}
