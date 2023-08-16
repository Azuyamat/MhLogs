import styles from "@/styles/components/Hero.module.css"
import {SignInButton, useUser} from '@clerk/nextjs'

const Hero = (props) => {

    const { isLoaded, isSignedIn, user } = useUser()

    return(
        <div className={styles.wrapper}>
            <h1 className={styles.title}>MHLOGS</h1>
            <h3 className={styles.subtitle}>Your modern solution for debugging server logs</h3>
            <a href="https://skript.lol" className={styles.partner}>Partnered with skript.lol</a>
            {!isSignedIn &&
                <SignInButton className={styles.signIn}/>
            }
        </div>
    )
}

export default Hero