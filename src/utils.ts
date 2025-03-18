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
    console.error(`${response.status} ${response.statusText}`);
    return new Response(null, {
      status: 303,
      headers: { Location: "/oops" },
    });
  }

  return new Response(null, {
    status: 303,
    headers: { Location: "/thank-you" },
  });
}

export function getContactFields(searchParams: URLSearchParams) {
  const fields = {
    name: { value: "", error: "" },
    email: { value: "", error: "" },
    message: { value: "", error: "" },
  };

  fields.name.value = searchParams.get("name")
    ? (searchParams.get("name") as string)
    : "";
  fields.name.error = searchParams.get("nameError")
    ? (searchParams.get("nameError") as string)
    : "";

  fields.email.value = searchParams.get("email")
    ? (searchParams.get("email") as string)
    : "";
  fields.email.error = searchParams.get("emailError")
    ? (searchParams.get("emailError") as string)
    : "";

  fields.message.value = searchParams.get("message")
    ? (searchParams.get("message") as string)
    : "";
  fields.message.error = searchParams.get("messageError")
    ? (searchParams.get("emailError") as string)
    : "";

  return fields;
}
