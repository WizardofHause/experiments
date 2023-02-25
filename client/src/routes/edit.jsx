import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateContact } from "../contacts"

export async function action({ request, params }){
    const formData = await request.formData();
    // Each field in the form is accessible with formData.get(name)
    // const firstName = formData.get("first");
    // const lastName = formData.get("last");

    const updates = Object.fromEntries(formData);
    // Since we have a handful of form fields, 
    // we used Object.fromEntries to collect them all into an object, 
    // which is exactly what our updateContact function wants.

    await updateContact(params.contactId, updates);
    return redirect(`/contacts/${params.contactId}`)
}

export default function EditContact() {
  const contact = useLoaderData();
  const navigate = useNavigate();

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={contact.notes}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        {/* A <button type="button">, while seemingly redundant, 
        is the HTML way of preventing a button from submitting the Form. */}
        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </p>
    </Form>
  );
}