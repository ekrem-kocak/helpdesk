import { AuthResponse } from '@helpdesk/shared/interfaces';

export class AuthResponseDto implements AuthResponse {
  accessToken!: string;
}
