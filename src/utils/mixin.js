import {date} from 'quasar'
import shajs from 'sha.js'
import identicon from 'identicon'

import {emojis1, emojis2} from './emojis'

export default {
  data() {
    return {
      emojis1,
      emojis2
    }
  },
  filters: {
    handler(value, value2) {
      if (value !== '') {
        return value
      } else {
        return value2
      }
    },
    niceDate(value) {
      let formattedString = date.formatDate(value, 'YYYY MMM D h:mm A')
      return formattedString
    }
  },
  methods: {
    avatarMake(data) {
      return identicon.generateSync({
        id: shajs('sha256').update(data).digest('hex'),
        size: 40
      })
    },
    toProfile(pubkey) {
      this.$router.push('/user/' + pubkey)
    }
  }
}
