export const toCamel = (job) => ({
  id: job.id,
  company: job.company,
  role: job.role,
  status: job.status,
  description: job.description,
  postingLink: job.posting_link,
  screenshotUrl: job.screenshot_url,
  userId: job.user_id,
  createdAt: job.created_at,
});

export const fromCamel = (job) => ({
  company: job.company,
  role: job.role,
  status: job.status,
  description: job.description,
  posting_link: job.postingLink,
  screenshot_url: job.screenshotUrl,
  user_id: job.userId,
});
