const BANNED_WORDS = [
  // Spanish
  'puta', 'puto', 'mierda', 'culo', 'coño', 'verga', 'pendejo', 'pendeja',
  'cabrón', 'cabron', 'hijo de puta', 'hdp', 'boludo', 'pelotudo', 'concha',
  'chinga', 'chingada', 'culero', 'culera', 'maricón', 'maricon', 'idiota',
  'imbécil', 'imbecil', 'estúpido', 'estupido', 'subnormal', 'gilipollas',
  // English
  'fuck', 'shit', 'ass', 'asshole', 'bitch', 'cunt', 'dick', 'cock',
  'nigger', 'faggot', 'whore', 'slut', 'bastard', 'motherfucker',
]

const BANNED_PATTERN = new RegExp(
  BANNED_WORDS.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
  'i'
)

export function containsBannedWords(text: string): boolean {
  // Normalize common character substitutions before checking
  const normalized = text
    .replace(/4/g, 'a')
    .replace(/3/g, 'e')
    .replace(/1/g, 'i')
    .replace(/0/g, 'o')
    .replace(/5/g, 's')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')

  return BANNED_PATTERN.test(normalized)
}

export const RATE_LIMIT = {
  MAX_COMMENTS: 15,
  WINDOW_MINUTES: 60,
}
