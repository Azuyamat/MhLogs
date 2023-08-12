import styles from "@/styles/components/Share.module.css"
import {useUser} from '@clerk/nextjs'
import {FaShareAlt, FaCopy} from "react-icons/fa";
import {showToast} from "@/components/Toast";
import {copyToClipboard} from "@/components/LogsArea";

import Profile from "@/components/Profile"
import {useCallback, useEffect, useRef, useState} from "react";
import Link from "next/link";
import {IoMdClose} from "react-icons/io";



function Share(props){

    const [shareLink, setShareLink] = useState("");

    const { isLoaded, isSignedIn, user } = useUser()
    const containerRef = useRef(null);
    const handleClose = useCallback(() => {
        props?.onClose();
    }, [props]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [containerRef, handleClose]);


    if (!isLoaded || !isSignedIn) {

        return null

    }



    const createShareLink = async (logs, user, e) => {
        showToast("Creating share link...")
        e.target.innerHTML = "Creating share link..."
        e.target.disabled = true
        e.target.style.boxShadow = "2px 2px 12px var(--primary)"
        try {
            const response = await fetch('/api/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: props.logs, username: user.username, userId: user.id }), // Adjust as needed
            });
            const responseData = await response.json();

            if (response.ok) {
                setShareLink("/log/" + responseData.timestamp)
                e.target.innerHTML = "Created share link"
                props.createShareLink("/log/" + responseData.timestamp)
                return true
            } else {
                console.log("Error")
                e.target.innerHTML = "Failed to create share link"
                return false
            }
        } catch (error) {
            console.error('Error:', error);
            showToast("An error occurred")
            e.target.innerHTML = "Failed to create share link"
            return false
        }
    }

    return (
        <div className={styles.wrapper}>
            <button className={styles.close} onClick={handleClose}><IoMdClose/></button>
            <div className={styles.container} ref={containerRef}>
                <Profile/>
                <p className={styles.warning}>
                    Are you sure you want to share your logs?
                    <br/>
                    Any content will be <span className={styles.highlight}>visible</span> to anyone who has access to the link.
                    <br/>
                    They will also be able to see your <span className={styles.highlight}>username</span>.
                    <br/><br/>
                    If you ever change your mind on sharing logs, please contact our email ASAP. <span className={styles.highlight}>discordazu@gmail.com</span>
                </p>
                <div className={styles.shareCtn}>
                    <button onClick={(e) => createShareLink(props.logs, user, e)}>Share <span className={styles.icon}><FaShareAlt/></span></button>
                </div>

                {shareLink &&
                    <div className={styles.linkCtn}>
                        <Link href={shareLink ? shareLink : "#"} className={styles.link}>{shareLink ? <p>https://mhlogs.com{shareLink}</p> : <p>No share link</p>}</Link>
                        <button className={styles.copy} onClick={(e) => {
                            e.target.style.boxShadow = "2px 2px 12px var(--primary)"
                            copyToClipboard("https://mhlogs.com"+shareLink)
                        }}><FaCopy/></button>
                    </div>}
            </div>
        </div>
    )
}

export default Share