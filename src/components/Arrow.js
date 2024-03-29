import React, { useState, useEffect } from "react";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import styles from "@/styles/components/Arrow.module.css";
import {FaPlus} from "react-icons/fa";

function Arrow() {
    const [showUpArrow, setShowUpArrow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            setShowUpArrow(scrollPosition > windowHeight);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <ul className={styles.list}>
            <li>
                <button
                    className={styles.circle}
                    onClick={(e) => {
                        if (showUpArrow) {
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });
                        } else {
                            window.scrollTo({
                                top: document.body.scrollHeight,
                                behavior: "smooth",
                            });
                        }
                    }}
                >
                    {showUpArrow ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
                </button>
            </li>
        </ul>
    );
}

export default Arrow;
