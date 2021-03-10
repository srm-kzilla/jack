export interface eventSchema {
  slug: string; // unique slug for the event
  name: string; // name for the event
  enabled: boolean; // if everyone can get their certificates
  type: "certificate" | "checkin"; // event type
  certificate?: {
    //certificate configuration
    x: number;
    y: number;
    maxWidth: number;
    maxHeight: number;
    url: string;
  };
  checkin?: {
    roleId: string;
    teamEvent: boolean;
    channelId: string;
  };
  ledgerChannel: string; // channel id for logging certficate collection / checkin confirmation
}

export interface eventUserSchema {
  userId: string;
  joinedDiscord?: boolean;
}

export interface registrantSchema {
  name: string;
  email: string;
  teamName?: string;
  checkedIn?: boolean;
}
