export const LAYOUT = {
  /** Sidebar width when expanded (desktop) */
  SIDEBAR_WIDTH_EXPANDED: 'w-64',
  /** Sidebar width when collapsed (desktop) */
  SIDEBAR_COLLAPSED_WIDTH: 'w-16',
  /** Main content margin when sidebar expanded */
  CONTENT_MARGIN_EXPANDED: 'ml-64',
  /** Main content margin when sidebar collapsed */
  CONTENT_MARGIN_COLLAPSED: 'ml-16',
  /** Right sidebar width in ticket detail */
  TICKET_SIDEBAR_WIDTH: '320px',
  /** Top header height */
  HEADER_HEIGHT: 'h-14',
} as const;

export const TICKET = {
  /** Number of characters to show from ticket ID */
  ID_DISPLAY_LENGTH: 8,
  /** Max width for ticket title in table */
  TITLE_MAX_WIDTH: 'max-w-75',
} as const;

export const MESSAGES = {
  /** Placeholder for incomplete features */
  COMING_SOON: '💡 Actions coming soon',
  /** Loading indicator text */
  LOADING: 'Loading...',
  /** Generic error message */
  ERROR_GENERIC: 'Something went wrong',
  /** Failed to load ticket */
  ERROR_LOAD_TICKET: 'Failed to load ticket',
} as const;

export const SIZES = {
  /** Minimum height for loading states */
  LOADING_MIN_HEIGHT: 'min-h-100',
  /** Avatar size in ticket creator section */
  AVATAR_LARGE: 'h-12 w-12',
  /** Avatar size in sidebar user section */
  AVATAR_SMALL: 'h-8 w-8',
} as const;

export const TRANSITIONS = {
  /** Sidebar collapse/expand duration */
  SIDEBAR: 'duration-300',
} as const;
