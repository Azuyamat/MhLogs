import { useRouter } from 'next/router';
import Color from "@/components/Color";
import LogsArea from "@/components/LogsArea";
import Footer from "@/components/Footer";
import {getLogContent} from "@/pages/api/logs";
import Loading from "@/components/Loading"
import styles from "@/styles/components/Loading.module.css"

function LogPage({ log, username, userId, timestamp }) {
    try{
        const router = useRouter();

        if (router.isFallback) {
            return <Loading/>;
        }
        if (log === ""){
            return (
                <>
                    <main className={styles.wrapper}>
                        <Color/>
                        <p className={styles.typingText}>Couldn{"'"}t find the requested logs</p>
                    </main>
                </>
            )
        }

        return (
            <>
                <main>
                    <Color/>
                    <LogsArea locked={true} content={log} sharedBy={username} userId={userId} timestamp={timestamp}/>
                    <Footer/>
                </main>
            </>
        );
    } catch(er){
        console.log("Render error: "+er)
    }
}


export async function getStaticPaths() {
    return { paths: [], fallback: true };
}

export const getStaticProps = async ({params}) => {
    const logId = params.id
    try {
        const logContent = await getLogContent(logId)
        return { props: { log: logContent.content, username: logContent.username, userId: logContent.userId, timestamp: logContent.timestamp } };
    } catch (error) {
        console.error('Error fetching log content:', error);
        return { props: { log: "" } };
    }
}

export default LogPage;
