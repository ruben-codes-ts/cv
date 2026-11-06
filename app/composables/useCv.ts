import { load } from 'js-yaml'
import en from '~~/data/cv.en.yaml?raw'
import nl from '~~/data/cv.nl.yaml?raw'

export type Lang = 'en' | 'nl'

const sources: Record<Lang, string> = { en, nl }

export const labels = {
  en: { experience: 'Experience', education: 'Education', projects: 'Projects', skills: 'Skills', languages: 'Languages', other: 'Nederlands', otherHref: '/nl', pdf: 'Download PDF',
    skillGroups: { testing: 'Testing', languages: 'Code', ci_and_ops: 'CI & ops', ai: 'AI', web: 'Web' } },
  nl: { experience: 'Werkervaring', education: 'Opleiding', projects: 'Projecten', skills: 'Vaardigheden', languages: 'Talen', other: 'English', otherHref: '/', pdf: 'Download pdf',
    skillGroups: { testing: 'Testen', languages: 'Code', ci_and_ops: 'CI & ops', ai: 'AI', web: 'Web' } },
}

export function useCv(lang: Lang) {
  return load(sources[lang]) as any
}

export const isUrl = (v?: string) => typeof v === 'string' && v.startsWith('http')
