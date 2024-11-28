import React, { useState } from "react";

const ChillGuyJokes = () => {
    const [joke, setJoke] = useState("");

    const chillJokes = [
        "When you don’t turn up to the 9 am lecture, but you’re just a chill guy who needs his beauty sleep.",
        "When you submit the assignment at 11:59 pm, but you’re just a chill guy who thrives under pressure.",
        "When you bring snacks to class instead of notes, but you’re just a chill guy who believes in vibes over scribes.",
        "When you forget the group meeting, but you’re just a chill guy who trusts his team to handle it.",
        "When you skip the gym but call it an active rest day, because you’re just a chill guy.",
        "When you study the night before the exam, but you’re just a chill guy who believes in last-minute miracles.",
        "When your laptop dies mid-lecture, but you’re just a chill guy who brings good energy, not chargers.",
        "When you show up late to the seminar with coffee, but you’re just a chill guy who values priorities.",
        "When you don’t turn up to the 9 am lecture, but you’re just a chill guy who needs his beauty sleep.",
    "When you submit the assignment at 11:59 pm, but you’re just a chill guy who thrives under pressure.",
    "When you bring snacks to class instead of notes, but you’re just a chill guy who believes in vibes over scribes.",
    "When you forget the group meeting, but you’re just a chill guy who trusts his team to handle it.",
    "When you skip the gym but call it an active rest day, because you’re just a chill guy.",
    "When you study the night before the exam, but you’re just a chill guy who believes in last-minute miracles.",
    "When your laptop dies mid-lecture, but you’re just a chill guy who brings good energy, not chargers.",
    "When you show up late to the seminar with coffee, but you’re just a chill guy who values priorities.",
    "When you nap instead of studying, but call it 'mentally preparing,' because you’re just a chill guy.",
    "When your lecture notes are just doodles, but you call it visual learning, because you’re just a chill guy.",
    "When you eat cereal for dinner and tell yourself it’s a balanced meal, because you’re just a chill guy saving time.",
    "When you call eating pizza for the third time this week 'tradition,' because you’re just a chill guy honoring the classics.",
    "When you skip the optional review session but say 'I’ll figure it out,' because you’re just a chill guy trusting the process.",
    "When you stay up all night watching Netflix and say, 'I'll sleep when I’m rich,' because you’re just a chill guy making investments in entertainment.",
    "When you run out of clean clothes and wear gym gear to class, because you’re just a chill guy keeping it sporty.",
    "When you sleep through your alarm and call it self-care, because you’re just a chill guy listening to his body.",
    "When you forget to charge your phone but call it a digital detox, because you’re just a chill guy embracing minimalism.",
    "When your assignment is two days late, but you tell your professor, 'Better late than never,' because you’re just a chill guy with a flexible timeline."
    ];

    const generateJoke = () => {
        const randomIndex = Math.floor(Math.random() * chillJokes.length);
        setJoke(chillJokes[randomIndex]);
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <img src="./images/logo.png" width="100px"></img>
            <h2>I'm Just a Chill Guy</h2>
            <p style={{ fontSize: "18px", fontStyle: "italic" }}>
                {joke || "Click the button to hear a relatable 'chill guy' moment!"}
            </p>
            <button
                onClick={generateJoke}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Get Chill Joke
            </button>
        </div>
    );
};

export default ChillGuyJokes;
