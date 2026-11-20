import type { ReactNode, SVGProps } from 'react'

export type IconName =
  | 'search'
  | 'plus'
  | 'copy'
  | 'check'
  | 'close'
  | 'chevron'
  | 'logo'
  | 'sparkle'
  | 'code'
  | 'palette'
  | 'shield'
  | 'pen'
  | 'server'
  | 'layers'
  | 'file'
  | 'filter'
  | 'script'
  | 'external'
  | 'trash'
  | 'info'

const paths: Record<IconName, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  check: <path d="m5 12 5 5L19 7" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  logo: (
    <>
      <path d="M12 2.5 4 5.5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11v-6l-8-3Z" />
      <path d="M12 8.5v6M9 11.5h6" />
    </>
  ),
  sparkle: (
    <>
      <path d="m12 3 1.7 4.8L18.5 9.5l-4.8 1.7L12 16l-1.7-4.8-4.8-1.7 4.8-1.7L12 3Z" />
      <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
    </>
  ),
  code: <path d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-11-4 14" />,
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18h1.4a2.1 2.1 0 0 0 0-4.2H12a2.1 2.1 0 0 1 0-4.2h6.2A2.8 2.8 0 0 0 21 9.8 6.8 6.8 0 0 0 12 3Z" />
      <circle cx="7.6" cy="11" r=".9" fill="currentColor" stroke="none" />
      <circle cx="10.4" cy="7.2" r=".9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="8" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  shield: <path d="M12 2.5 4 5.5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11v-6l-8-3Z" />,
  pen: (
    <>
      <path d="M12 20h9" />
      <path d="M16.6 3.4a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.6-11.6Z" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </>
  ),
  layers: <path d="m12 2.5 9 5-9 5-9-5 9-5Zm-9 9.5 9 5 9-5M3 17l9 5 9-5" />,
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />
      <path d="M14 2v6h6" />
    </>
  ),
  filter: <path d="M4 5h16l-6 7.2V19l-4 2v-8.8L4 5Z" />,
  script: (
    <>
      <path d="m8 4-4 3 4 3M4 7h9a4 4 0 0 1 0 8H7" />
      <path d="M17 18h3" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
}

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
}

export function Icon({ name, size = 18, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  )
}
