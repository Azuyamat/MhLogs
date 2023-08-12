import { SignIn } from "@clerk/nextjs";
import styles from "@/styles/clerk/Sign-in.module.css"
import Footer from "@/components/Footer";


export default function Page() {

    return (
        <>
            <div className={styles.wrapper}>
                <h1 className={styles.title}>MHLogs</h1>
                <p className={styles.context}>
                    To start using our service, you must first authenticate. This is to prevent users from abusing certain sharing features. The process will only take a few minutes and you won{"'"}t ever need to log back in.
                </p>
                <SignIn />
            </div>
            <Footer/>
        </>
    )

}