export interface ProfileFormValues {
  full_name: string;
  phone: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  updated_at: string;
}