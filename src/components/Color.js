import { useState, useEffect } from 'react';
import styles from '@/styles/components/Color.module.css';
import {AiOutlineBgColors} from "react-icons/ai";
import {showToast} from "@/components/Toast";
import {IoIosCheckmarkCircle} from "react-icons/Io";

const Color = () => {
    const [selectedColor, setSelectedColor] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Retrieve the color preference from localStorage on component mount
        const userColorPreference = localStorage.getItem('userColorPreference');
        if (userColorPreference) {
            setSelectedColor(userColorPreference);
            document.documentElement.style.setProperty('--primary', userColorPreference);
        }
    }, []);

    function handleColorChange(color) {
        setSelectedColor(color);
        document.documentElement.style.setProperty('--primary', color);
        localStorage.setItem('userColorPreference', color);
        showToast("Changed color to "+color)
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const uniqueColors = [
        "#FF0000", "#2335af", "#9221b7", "#ff8000", "#00fff7",
        "#68e886", "#c98080", "#FFA500", "#00FF00", "#800080",
        "#FFFF00", "#00FFFF", "#FF00FF", "#008000", "#FFC0CB",
        "#FFD700", "#1E90FF", "#FF69B4", "#ADFF2F", "#FF4500"
    ];

    return (
        <>
            <button className={styles.chooseColor} onClick={() => setIsOpen(true)}><AiOutlineBgColors/></button>
            {isOpen && (
                <div className={styles.overlay}>
                    <div className={styles.colorPickerContainer}>
                        <h1 className={styles.title}>What is your favorite color?</h1>
                        <div className={styles.colorPicker}>
                            {uniqueColors.map((color, index) => (
                                <ColorBlock key={index} color={color} />
                            ))}
                        </div>
                        <div className={styles.closeButton} onClick={handleClose}>Apply changes</div>
                    </div>
                </div>
            )}
        </>
    );

    function ColorBlock(props){

        return (
            <>
                <button style={{background:props.color}} data-selected={selectedColor === props.color ? "true" : "false"} className={styles.block} onClick={() => handleColorChange(props.color)}>{(selectedColor === props.color) &&
                    <div className={styles.icon}><IoIosCheckmarkCircle/></div>}</button>
            </>
        )
    }
};


export default Color;
