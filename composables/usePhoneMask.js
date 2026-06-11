export function phoneMask(val) {
  const d = (val || '').replace(/\D/g, '').slice(0, 11)
  if (!d) return ''
  let s = d[0] === '8' ? '7' + d.slice(1) : d[0] === '7' ? d : '7' + d
  s = s.slice(0, 11)
  let r = '+7'
  if (s.length > 1) r += ' (' + s.slice(1, Math.min(4, s.length))
  if (s.length >= 4) r += ')'
  if (s.length > 4) r += ' ' + s.slice(4, Math.min(7, s.length))
  if (s.length > 7) r += '-' + s.slice(7, Math.min(9, s.length))
  if (s.length > 9) r += '-' + s.slice(9, 11)
  return r
}
