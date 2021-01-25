import {LocalStorage} from 'quasar'

export default function (store) {
  store.subscribe(({type, payload}, state) => {
    switch (type) {
      case 'setProfile':
      case 'relayPush':
      case 'relaySplice':
        LocalStorage.set('myProfile', state.main.myProfile)
        break
      case 'startFollowing':
      case 'stopFollowing':
        LocalStorage.set('theirProfile', state.main.theirProfile)
        break
      case 'addKind1':
      case 'replaceKind1':
      case 'deleteKind1':
        LocalStorage.set('kind1', state.main.kind1)
        break
      case 'addKind4':
      case 'replaceKind4':
        LocalStorage.set('kind4', state.main.kind4)
        break
    }
  })
}
