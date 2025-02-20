export interface SchoolFeesSetting {
    id: number;
    reason: string;
    level: string;
    term: string;
    year: string;
    total: number;
    timestamp: string;
    schoolAdmin: {
      id: number;
    };
  }