export interface ResetPayload {
  token: string;
  name: string;
}
export interface AdminOrAgentWelcomeType {
  name: string;
  email: string;
  password?: string;
  organizationName: string;
}

export interface ComplaintAssignedPayload {
  name: string;
  email: string;
  token: string;
}

export interface ResolveComplaintPayload {
  name: string;
  email: string;
  complaintTag: string;
  token: string;
}
