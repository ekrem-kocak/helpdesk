export const LAYOUT = {
  /** Sidebar width when expanded (desktop) */
  SIDEBAR_WIDTH_EXPANDED: 'w-64',
  /** Sidebar width when collapsed (desktop) */
  SIDEBAR_COLLAPSED_WIDTH: 'w-16',
  /** Top header height */
  HEADER_HEIGHT: 'h-14',
} as const;

export const TICKET = {
  /** Number of characters to show from ticket ID */
  ID_DISPLAY_LENGTH: 8,
} as const;

export const MESSAGES = {
  /** Placeholder for incomplete features */
  COMING_SOON: '💡 Actions coming soon',
  /** Failed to load ticket */
  ERROR_LOAD_TICKET: 'Failed to load ticket',
} as const;

export const TRANSITIONS = {
  /** Sidebar collapse/expand duration */
  SIDEBAR: 'duration-300',
} as const;
