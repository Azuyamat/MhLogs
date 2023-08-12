import styles from "@/styles/components/Loading.module.css"
import {useEffect, useState} from "react";

const Loading = () => {
    const [loadingText, setLoadingText] = useState("The loading part is boring");

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingText(prevText => {
                if (prevText.endsWith("...")) {
                    return "The loading part is boring";
                }
                return prevText + ".";
            });
        }, 500); // Adjust the interval as needed

        return () => clearInterval(interval);
    }, []);
    return (
        <div className={styles.wrapper}>
            <p className={styles.typingText}>{loadingText}</p>
        </div>
    )
}
export default Loading