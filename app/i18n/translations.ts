import esTranslations from './es.json'
import enTranslations from './en.json'

export type Language = 'es' | 'en'

export type Translations = typeof esTranslations

export const translations: Record<Language, Translations> = {
  es: esTranslations,
  en: enTranslations,
}
