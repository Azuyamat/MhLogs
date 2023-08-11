import LogsArea from "@/components/LogsArea";
import Footer from "@/components/Footer";
import Color from "@/components/Color";
import styles from "@/styles/LogsArea.module.css";

export default function Home() {
  return (
    <>
      <main>
          <h1 className={"title"}>
              <a href={"https://mhlogs.com"}>MHLOGS</a>
          </h1>
          <Color/>
          <LogsArea/>
          <Footer/>
      </main>
    </>
  )
}
