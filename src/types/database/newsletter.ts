import { BaseRow } from "./base";

export interface NewsletterSubscriptionRow extends BaseRow {
  email: string;
}

export type NewsletterSubscriptionInsert = Omit<NewsletterSubscriptionRow, "id" | "created_at" | "updated_at">;
export type NewsletterSubscriptionUpdate = Partial<NewsletterSubscriptionInsert>;