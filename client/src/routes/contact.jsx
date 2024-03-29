import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

export async function action({ request, params }){
    let formData = await request.formData();
    return updateContact(params.contactId, {
        favorite: formData.get("favorite") === "true",
    });
}
// ^^^ Pulls the form data off the request and sends it to the data model.

// export async function loader({ params }) {
//     const contact = await getContact(params.contactId);
//     return { contact };
// }

export async function loader({ params }) {
    const contact = await getContact(params.contactId);
    if(!contact){
        throw new Response("", {
            status: 404,
            statusText: "Not Found",
        });
    }
    return { contact };
}
// ^^^updated loader with error handling included, 
// so <Contact/> doesn't have to manage error/loading states

export default function Contact() {
    // const contact = {
    //     first: "Your",
    //     last: "Name",
    //     avatar: "https://placekitten.com/g/200/200",
    //     twitter: "your_handle",
    //     notes: "Some notes",
    //     favorite: true,
    // };
    const { contact } = useLoaderData();

    return (
        <div id="contact">
            <div>
                <img
                    key={contact.avatar}
                    src={contact.avatar || null}
                />
            </div>

            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    <Favorite contact={contact} />
                </h1>

                {contact.twitter && (
                    <p>
                        <a
                            target="_blank"
                            href={`https://twitter.com/${contact.twitter}`}
                        >
                            {contact.twitter}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    {/* <Form action> can take a relative value. 
                    Since the form is rendered in contact/:contactId, 
                    then a relative action with destroy will submit the form 
                    to contact/:contactId/destroy when clicked. */}
                    <Form
                        method="post"
                        action="destroy"
                        onSubmit={(event) => {
                            if (
                                !confirm(
                                    "Please confirm you want to delete this record."
                                )
                            ) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

function Favorite({ contact }) {
    const fetcher = useFetcher();
    let favorite = contact.favorite;
    if(fetcher.formData){
        favorite = fetcher.formData.get("favorite") === "true";
    }
    return (
        <fetcher.Form method="post">
            <button
                name="favorite"
                value={favorite ? "false" : "true"}
                aria-label={
                    favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }
            >
                {favorite ? "★" : "☆"}
            </button>
        </fetcher.Form>
    );
}