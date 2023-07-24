import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "@/styles/Toast.module.css";



function Toast({ id, message, duration = 3000, onClose }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        if (!show) {
            onClose(id); // Pass the ID to onClose when toast is about to be removed
        }
    }, [show, id, onClose]);

    return (
        <>
            {show && (
                <div className={styles.toast}>
                    <span className={styles.message}>{message}</span>
                    <button className={styles.closeButton} onClick={handleClose}>
                        &times;
                    </button>
                </div>
            )}
        </>
    );
}


const displayedToastIds = [];
export function showToast(message,id=(Date.now().toString()),duration = 3000) {

    if (displayedToastIds.includes(id)) {
        return;
    }

    displayedToastIds.push(id);

    const toastRoot = document.getElementById("toastContainer");
    if (!toastRoot) {
        const newToastRoot = document.createElement("div");
        newToastRoot.id = "toastContainer";
        newToastRoot.className = styles.toastContainer;
        document.body.appendChild(newToastRoot);
    }

    const handleClose = () => {
        const currentToast = document.getElementById("toast_" + toastId);
        if (currentToast) {
            ReactDOM.unmountComponentAtNode(currentToast);
            toastRoot.removeChild(currentToast);

            // Remove the ID from the displayed list when toast is removed
            const index = displayedToastIds.indexOf(toastId);
            if (index !== -1) {
                displayedToastIds.splice(index, 1);
            }
        }
    };

    const toastId = Date.now();
    const toastElement = document.createElement("div");
    toastElement.id = "toast_" + toastId;
    toastRoot.appendChild(toastElement);

    ReactDOM.render(
        <Toast
            message={message}
            duration={duration}
            onClose={handleClose}
            key={toastId}
        />,
        toastElement
    );
}

export default Toast;
