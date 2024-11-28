import React, { useState, useEffect } from "react";

const BubblePop = () => {
    const [bubbles, setBubbles] = useState([]);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBubbles((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    x: Math.random() * 90,
                    y: Math.random() * 80,
                },
            ]);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const popBubble = (id) => {
        setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));
        setScore((prev) => prev + 1);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px", position: "relative", height: "300px", background: "#e0f7fa" }}>
            <h2>Bubble Pop</h2>
            <p>Score: {score}</p>
            {bubbles.map((bubble) => (
                <div
                    key={bubble.id}
                    onClick={() => popBubble(bubble.id)}
                    style={{
                        position: "absolute",
                        top: `${bubble.y}%`,
                        left: `${bubble.x}%`,
                        width: "30px",
                        height: "30px",
                        backgroundColor: "#4CAF50",
                        borderRadius: "50%",
                        cursor: "pointer",
                    }}
                />
            ))}
        </div>
    );
};

export default BubblePop;
