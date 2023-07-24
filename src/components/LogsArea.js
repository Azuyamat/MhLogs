import styles from "@/styles/LogsArea.module.css"
import React, {useState} from 'react';
import {randomInt} from "next/dist/shared/lib/bloom-filter/utils";
import {AiFillWarning, AiFillInfoCircle, AiOutlineAlignLeft} from "react-icons/ai";
import {FaServer} from "react-icons/fa";
import Toast, {showToast} from "@/components/Toast";
import Arrow from "@/components/Arrow"

let construction = [];
let errConstruction = [];
let serverVersion = 0;
let longVer = "";

function LogsArea(props){

    const notDefined = "Not defined"
    const [logs, setLogs] = useState(<div>text</div>)
    const [version, setVersion] = useState("")
    const [errors, setErrors] = useState(0)
    const [lines, setLines] = useState(0)
    const [errs, setErrs] = useState([<div key={"jeff"}>None yet.</div>])

    function analyze(text){
        construction = [];
        errConstruction = [];
        setLogs(<div>{text}</div>)
        showToast("Analyzed log file")
    }

    return (
        <>
            <Arrow/>
            <h1 className={styles.title}><button onClick={e => {
                document.getElementById("logsArea").scrollIntoView({block: "center", behavior: "smooth"});
            }}>MHLOGS</button></h1>
            <div className={styles.wrapper} id={"wrapper"}>
                <div className={styles.ctn}>
                    <h2><span className={styles.icon}><AiOutlineAlignLeft/></span> Paste your logs below</h2>
                    <div className={styles.textAreaCtn}>
                        <textarea name="logs" id={"logsArea"} cols="30" rows="10" placeholder={"Paste your" +
                            " logs here"} className={styles.logsArea} onInput={(e)=>{
                            //document.getElementById("pro_btn").style.display = 'inherit'
                            analyze(document.getElementById("logsArea").value)
                        }} spellCheck={false} autoComplete={"off"}/>
                    </div>
                </div>
                <div className={styles.ctn}>
                    <h2><span className={styles.icon}><FaServer/></span> Server Information</h2>
                    <div className={styles.serverInfo}>
                        <ul>
                            <li>Server Version: <span className={styles.highlight}> {version}</span></li>
                            <li>Server Type: <span className={styles.highlight}> {longVer.replace("on", "")}</span></li>
                            <li>Errors: <span style={{color:"red"}}> {errors}</span></li>
                            <li>Lines: <span style={{color:"orange"}}> {lines}</span></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.ctn}>
                    <h2><span className={styles.icon}><AiFillWarning/></span> Server Errors</h2>
                    <div className={styles.errors}>
                        {errs}
                    </div>
                </div>
                <div className={styles.ctn}>
                    <h2><span className={styles.icon}><AiFillWarning/></span> {version} {longVer} Minecraft Server</h2>
                    <div>
                        <Results logs={logs} id={"jeff"}/>
                    </div>
                </div>
            </div>
        </>

    )

    function Results(props){
        const text = props.logs.props.children
        const split = text.split("\n");
        let er = 0;
        let i = 0;
        if (text === "text") return
        for (let s in split){
            const t = split[s]
            if (t === "") continue
            let time = ""
            const array = t.match(new RegExp("(?<time>^[[]\\d\\d:\\d\\d:\\d\\d])(?<text>.+)", "gm"))
            if (!array && document.getElementById("line_"+(parseInt(s)+1)) === null){
                construction.push(<Result key={randomInt(0, 999999999999)} line={parseInt(s)+1} text={time} type={"INFO"} time={time}>{t}</Result>)
            }
            for (let a in array){
                time = array[a].match(new RegExp("[[]\\d\\d:\\d\\d:\\d\\d]"))[0]
                let content = array[a].replace(time, "")
                const r = content.match(new RegExp("[[](?<type>.*?)\\/(?<infoType>\\w+)]"))
                let type = "INFO"
                if (r != null){
                    if (r.groups != null){
                        if (r.groups.infoType != null) type = r.groups.infoType
                    }
                }
                let things = {
                    "ModernPluginLoadingStrategy": "An error is occurring with the plugin mentioned above. Either try to fix it or switch to another plugin",
                    "Could not pass event": "This means an event in the plugin above is not being registered properly. The plugin might unload due to this. Hence, you won't be able to use it. To resolve this issue, install a more up to date version of the plugin or one that doesn't have the same issue.",
                }
                let reason = "No suggested fixes";
                if (content.includes("Starting minecraft server version")){
                    serverVersion = content.match("Starting minecraft server version (.+)")[1]
                    setVersion(serverVersion)
                }
                if (content.includes("This server is running")){
                    longVer = content.match("This server is running (.+)")[1]
                    //document.getElementById("longVersion").innerText = longVer;
                }
                let regex = /(\w+|\d+|\D)([[]\/\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}:\d{0,7}])/gm
                content = content.replace(regex, "REDACTED IP")
                if (type === "ERROR"){
                    er++
                    for (const h in things){
                        if (content.includes(h)) reason = things[h]
                    }
                }
                if (document.getElementById("line_"+(parseInt(s)+1)) !== null) continue
                else {
                    construction.push(<Result key={randomInt(0, 999999999999)} line={parseInt(s)+1} text={time} type={type.replace("FATAL", "ERROR").replace("DEBUG", "INFO").replace("TRACE", "TRACE")} time={time} reason={reason}>{content}</Result>)
                    if (type.toLowerCase().replace("FATAL", "error") === "error"){
                        errConstruction.push(<Result key={randomInt(0, 999999999999)} line={parseInt(s)+1} text={time} type={type.replace("FATAL", "ERROR")} err={true} time={time} reason={reason}>{content}</Result>)
                    }
                }
            }
            i=s
        }
        setLines(parseInt(i)+1)
        setErrors(er)
        setErrs(errConstruction)
        if (text !== "text") document.title = ""+version+" "+longVer+" Minecraft Server - MHLOGS"
        return(
            <div className={styles.construction}>{construction}</div>
        )
    }

    function Result(props){
        return (
            <div className={styles.line} data-type={props.type} id={"line_"+props.line+(props.err ? "_err" : "")}>
                <p className={styles.num}>{props.line}</p>
                {props.err ?
                    <button onClick={(e) => {
                        document.getElementById("line_"+props.line).scrollIntoView({block: "center", behavior: "smooth"});
                    }}>
                        <div className={styles.box}>
                            {props.time}
                            <span>{props.children}</span>
                            {props.type === "ERROR" ? <div className={styles.moreInfo}>{props.reason}</div> : ""}
                        </div>
                    </button>
                :
                    <div className={styles.box}>
                        {props.time}
                        <span>{props.children}</span>
                        {props.type === "ERROR" ? <div className={styles.moreInfo}>{props.reason}</div> : ""}
                    </div>}
            </div>
        )
    }
}


export default LogsArea