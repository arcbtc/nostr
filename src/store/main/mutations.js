export function setProfile(state, profile) {
  state.myProfile = profile
}

export function relayPush(state, url) {
  state.myProfile.relays.push(url)
}

export function relaySplice(state, url) {
  let index = state.myProfile.relays.indexOf(url)
  if (index === -1) return
  state.myProfile.relays.splice(index, 1)
}

export function startFollowing(state, key) {
  state.theirProfile.push({
    pubkey: key,
    avatar: null,
    handle: null,
    about: null
  })
}

export function stopFollowing(state, key) {
  let index = state.theirProfile.findIndex(({pubkey}) => pubkey === key)
  if (index !== -1) state.theirProfile.splice(index, 1)
}

export function addKind1(state, event) {
  state.kind1.unshift(event)
}

export function replaceKind1(state, {index, event}) {
  state.kind1[index] = event
}

export function deleteKind1(state, id) {
  let index = state.kind1.findIndex(event => event.id === id)
  if (index !== -1) state.kind1.splice(index, 1)
}

export function addKind4(state, event) {
  state.kind4.unshift(event)
}

export function replaceKind4(state, {index, event}) {
  state.kind4[index] = event
}
