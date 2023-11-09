
export type availableTimeType = {
	time: string,
	users: string[],
  starred: boolean
}

export type OrgType = {
  free: availableTimeType[];
  username: string
}
export type OrgContextType = {
  scheduleData: OrgType | null;
  updateScheduleData: React.Dispatch<React.SetStateAction<OrgType | null>>;
  LogIn: (token: string) => any;
  LogOut: () => any;
  SignUp: (username: string) => any;
  error: string | null;
  pending: boolean;
}
