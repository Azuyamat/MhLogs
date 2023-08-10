import { useRouter } from 'next/router';
import Color from "@/components/Color";
import LogsArea from "@/components/LogsArea";
import Footer from "@/components/Footer";

function LogPage({ log }) {
    try{
        const router = useRouter();

        if (router.isFallback) {
            return <div>Loading...</div>;
        }

        return (
            <>
                <main>
                    <Color/>
                    <LogsArea locked={true} content={log}/>
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

export async function getStaticProps({ params }) {
    const logId = params.id;

    try {
        const response = await fetch(`https://mhlogs.com/api/logs?timestamp=${logId}`);
        const logContent = await response.json();

        return { props: { log: logContent.content } };
    } catch (error) {
        console.error('Error fetching log content:', error);
        return { props: { log: "" } };
    }
}

export default LogPage;
