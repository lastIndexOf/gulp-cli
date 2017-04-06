exports.hmtlEncode = str => {
  let s = ''

  s = str
    .replace(/&/g, '&gt;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\s/g, '&nbsp;')
    .replace(/\'/g, '&#39;')
    .replace(/\"/g, '&quot;')
    .replace(/\n/g, '<br>')

  return s
}