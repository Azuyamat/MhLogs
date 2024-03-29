import styles from '@/styles/components/Footer.module.css'
import {AiFillGithub} from "react-icons/ai";
import Link from "next/link";

function Footer(){
    return(
        <div className={styles.container}>
            <p className={styles.socials}>Project Information</p>
            <ul className={styles.list}>
                <li className={styles.listItem}><a aria-label="Visit my github URL" href="https://github.com/Azuyamat/MhLogs/"><AiFillGithub/></a></li>
            </ul>
            <p className={styles.desc}>Thank you for visiting my website!<br/>This is coded by <a href="https://azuyamat.com">Azuyamat</a> using <a
                href="https://vercel.com">Vercel</a> and <a href="https://nextjs.com">NextJS</a>
                <br/><br/>
                <Link href={"/policy"} className={styles.highlight}>Privacy Policy</Link>
            </p>
        </div>
    )
}

export default Footer