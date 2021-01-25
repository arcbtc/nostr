import {LocalStorage} from 'quasar'

export function disabled(state) {
  return LocalStorage.has('myProfile') === false
}
