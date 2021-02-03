import identicon from 'identicon'

export function disabled(state) {
  return !state.myProfile
}

export function handle(state, pubkey) {
  return pubkey => {
    let profile = state.theirProfile[pubkey]
    if (profile && profile.name) return profile.name

    let kind0 = state.kind0[pubkey]
    if (kind0 && kind0.name) return profile.name

    return pubkey.slice(0, 20) + '...'
  }
}

export function avatar(state) {
  return pubkey => {
    let profile = state.theirProfile[pubkey]
    if (profile && profile.picture) return profile.picture

    let kind0 = state.kind0[pubkey]
    if (kind0 && kind0.picture) return profile.picture
    return identicon.generateSync({id: pubkey, size: 40})
  }
}
