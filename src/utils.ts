export const isValidEmail = (email: string | null) => {
  return email ? email.includes("@") : false;
};

export async function sendMail(data: FormData) {
  const url = "https://api.sendgrid.com/v3/mail/send";
  const message = `Name: ${data.get("name")}\n\n Email: ${data.get(
    "email"
  )}\n\n Message: ${data.get("message")}`;
  const emailData = {
    personalizations: [
      {
        to: [{ email: "rastislav.hepner@gmail.com" }],
      },
    ],
    from: { email: "rastislav.hepner@gmail.com" },
    subject: "Someone reached out from your portfolio",
    content: [
      {
        type: "text/plain",
        value: message,
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    throw new Error(`Sending email has failed with status: ${response.status}`);
  }

  return new Response(null, {
    status: 303,
    headers: { Location: "/thank-you" },
  });
}
