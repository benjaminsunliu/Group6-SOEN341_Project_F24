import React, { useState } from "react";

const emojis = ["🌟", "🍀", "☀️", "🌙", "⭐", "🌈"];
const shuffledEmojis = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

const EmojiMatch = () => {
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);

    const handleFlip = (index) => {
        if (flipped.length === 2 || matched.includes(index)) return;

        const newFlipped = [...flipped, index];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (shuffledEmojis[first] === shuffledEmojis[second]) {
                setMatched((prev) => [...prev, first, second]);
            }
            setTimeout(() => setFlipped([]), 1000);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Emoji Match</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 50px)", gap: "10px", justifyContent: "center" }}>
                {shuffledEmojis.map((emoji, index) => (
                    <div
                        key={index}
                        onClick={() => handleFlip(index)}
                        style={{
                            width: "50px",
                            height: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: flipped.includes(index) || matched.includes(index) ? "#4CAF50" : "#e0e0e0",
                            cursor: "pointer",
                            fontSize: "24px",
                            borderRadius: "5px",
                        }}
                    >
                        {flipped.includes(index) || matched.includes(index) ? emoji : ""}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmojiMatch;
