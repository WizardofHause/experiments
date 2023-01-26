import { useState, useEffect } from "react";

export default function Root() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        fetch("/api/hello")
            .then((r) => r.json())
            .then((data) => setCount(data.count));
            console.log(count)
    }, []);

    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>
                <h1>Page Count: {count}</h1>
                <div>
                    <form id="search-form" role="search">
                        <input
                            id="q"
                            aria-label="Search contacts"
                            placeholder="Search"
                            type="search"
                            name="q"
                        />
                        <div
                            id="search-spinner"
                            aria-hidden
                            hidden={true}
                        />
                        <div
                            className="sr-only"
                            aria-live="polite"
                        ></div>
                    </form>
                    <form method="post">
                        <button type="submit">New</button>
                    </form>
                </div>
                <nav>
                    <ul>
                        <li>
                            <a href={`/contacts/1`}>Your Name</a>
                        </li>
                        <li>
                            <a href={`/contacts/2`}>Your Friend</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div id="detail"></div>
        </>
    );
}