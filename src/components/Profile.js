import { useUser } from '@clerk/nextjs'
import styles from "@/styles/components/Profile.module.css"
import Image from "next/image"

const Profile = () => {

    const { isLoaded, isSignedIn, user } = useUser()
    const pfpSize = 50


    if (!isLoaded || !isSignedIn) {

        return null

    }

    return (
        <div className={styles.container}>
            <div className={styles.pfp}><Image alt={"Profile picture"} src={user.imageUrl} width={pfpSize} height={pfpSize}/></div>
            <div className={styles.information}>
                <p className={styles.fieldLabel}>Username:</p>
                <p className={styles.username}>@{user.username}</p>
            </div>

        </div>
    )

}

export default Profile