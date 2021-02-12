export interface eventSchema {
  slug: string; // unique slug for the event
  name: string; // name for the event
  enabled: boolean; // if everyone can get their certificates
  certificate: {
    //certificate configuration
    x: number;
    y: number;
    maxWidth: number;
    maxHeight: number;
    url: string;
  };
  ledgerChannel: string; // channel id for logging certficate collection
}

export interface eventUserSchema {
  userId: string;
  joinedDiscord?: boolean;
}
