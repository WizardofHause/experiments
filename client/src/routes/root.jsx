import { useState, useEffect } from "react";
import { Outlet, NavLink, useLoaderData, Form, redirect, useNavigation, useSubmit } from "react-router-dom";
import { getContacts, createContact } from "../contacts";

export async function action() {
    const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`)
}

// export async function loader() {
//     const contacts = await getContacts();
//     return { contacts };
// }
// ^^^ old loader function w/o search functionality


// The search Form `q` is a GET, not a POST, so React Router does not call the action. 
// Submitting a GET form is the same as clicking a link: only the URL changes. 
// That's why the code we added for filtering is in the `loader`, not the `action` of this route.
export async function loader({ request }) {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const contacts = await getContacts(q);
    return { contacts, q };
  }
// ^^^modified loader function to handle search params

export default function Root() {
    const [count, setCount] = useState(0);
    const { contacts, q } = useLoaderData();
    const navigation = useNavigation();
    const submit = useSubmit();

    const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

    useEffect(() => {
        fetch("/api/hello")
            .then((r) => r.json())
            .then((data) => setCount(data.count));
    }, []);
    console.log(count)

    useEffect(() => {
        document.getElementById("q").value = q;
      }, [q]);
      
    return (
        <>
            <div id="sidebar">
                {/* <h1>React Router Contacts</h1> */}
                <h1>Page Count: {count}</h1>
                <div>
                    {/* Default Form `method` is `get` & the name of our form is `q` */}
                    <Form id="search-form" role="search">
                        <input
                            id="q"
                            className={searching ? "loading" : ""}
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                            defaultValue={q}
                            // With defaultValue={q}, if you refresh the page after searching, 
                            // the form field will retain the value in it, 
                            // and the list will remain filtered.
                            // This sets our URL and form state back into sync.

                            // onChange={(event) => submit(event.currentTarget.form)}
                            // ^^^old change handler that submits the search form with each keystroke
                            // THIS IS A BAD THING!

                            // instead we can REPLACE the current search entry in the history stack
                            // with the next page, instead of pushing into it and creating more queries
                            onChange={(event) => {
                                const isFirstSearch = q == null;
                                submit(event.currentTarget.form, {
                                    replace: !isFirstSearch,
                                });
                            }}
                            // ^^^ this prevents new entries in the browser history with each keystroke,
                            // AND the user can click BACK just once to get out of the search results.

                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={!searching}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </Form>
                    <Form method="post">
                        <button type="submit">New</button>
                    </Form>
                </div>
                <nav>
                    {contacts.length ? (
                        <ul>
                            {contacts.map((contact) => (
                                <li key={contact.id}>
                                    {/* Note that we are passing a function to className. 
                                    When the user is at the URL in the NavLink, then isActive will be true. 
                                    When it's about to be active (the data is still loading) then isPending will be true. */}
                                    <NavLink to={`contacts/${contact.id}`} className={({ isActive, isPending }) =>
                                        isActive
                                            ? "active"
                                            : isPending
                                                ? "pending"
                                                : ""
                                    }
                                    >
                                        {contact.first || contact.last ? (
                                            <>
                                                {contact.first} {contact.last}
                                            </>
                                        ) : (
                                            <i>No Name</i>
                                        )}{" "}
                                        {contact.favorite && <span>★</span>}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>
                            <i>No contacts</i>
                        </p>
                    )}
                </nav>
            </div>
            {/* useNavigation returns the current navigation state: it can be one of "idle" | "submitting" | "loading" */}
            <div id="detail" className={navigation.state === "loading" ? "loading" : ""}>
                {/* <Outlet/> tells the component WHERE to render the child route for <Contact/> */}
                <Outlet />
            </div>
        </>
    );
}