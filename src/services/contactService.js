const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5116/api/v1';

/**
 * Submits the contact form.
 * Sends confirmation email to the user and the form data to the admin inboxes.
 */
export async function submitContactForm({ name, email, subject, message, country, enquiryType, enquiryOther }) {
  const response = await fetch(`${API_URL.replace(/\/$/, '')}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      email,
      subject,
      message,
      country: country?.value || '',
      enquiryType: enquiryType?.value === 'Other' ? `Other — ${enquiryOther}` : enquiryType?.value || '',
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to send message.');
  }

  return data;
}
