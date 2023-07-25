import styles from "@/styles/LogsArea.module.css"
import React, {useState} from 'react';
import {randomInt} from "next/dist/shared/lib/bloom-filter/utils";
import {AiFillWarning, AiOutlineAlignLeft, AiOutlineArrowDown} from "react-icons/ai";
import {FaServer} from "react-icons/fa";
import {showToast} from "@/components/Toast";
import Arrow from "@/components/Arrow"
import Container from "@/components/Container";

let construction = [];
let errConstruction = [];
let serverInfo =
    {
        "errors": 0,
        "lines": 0,
        "version": "",
        "longVer": ""
    }

function LogsArea(props) {

    const [logs, setLogs] = useState(<div>text</div>)

    const [errorCount, setErrorCount] = useState(0)
    const [lineCount, setLineCount] = useState(0)
    const [serverVersion, setServerVersion] = useState("")
    const [serverLongVersion, setServerLongVersion] = useState("")
    const [errorConstruction, setErrorConstruction] = useState(<div>None yet</div>)
    const [selectedFile, setSelectedFile] = useState(null);


    function analyze(text) {
        construction = [];
        errConstruction = [];
        resetAnalysis()
        showToast("Analyzing log file")
        setTimeout(() => {
            setLogs(<div>{text}</div>)
        }, 100)
    }

    function resetAnalysis() {
        setErrorCount(0)
        setLineCount(0)
        setServerVersion("")
        setServerLongVersion("")
        setErrorConstruction(<div>None yet</div>)
        setLogs(<div>text</div>)
    }

    function handleFileChange(event) {
        const file = event.target.files[0];
        handleFile(file)
    }

    function handleDrop(event) {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        handleFile(file)
    }

    function handleFile(file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result
                document.getElementById("logsArea").value = text
                analyze(text)
            };
            reader.readAsText(file);
            setSelectedFile(file)
        }
    }

    return (
        <>
            <Arrow/>
            <h1 className={styles.title}>
                <button onClick={e => {
                    document.getElementById("logsArea").scrollIntoView({block: "center", behavior: "smooth"});
                }}>MHLOGS
                </button>
            </h1>
            <div className={styles.wrapper} id={"wrapper"} onDrop={handleDrop}>
                <Container>
                    <h2><span className={styles.icon}><AiOutlineAlignLeft/></span> Upload Log File or Drop It</h2>
                    <div className={styles.customFileInput}>
                        <label htmlFor="fileInput" className={styles.labelCtn}>
                            <p>Choose File</p>
                            <span className={styles.arrow}><AiOutlineArrowDown/></span>
                        </label>
                        <input
                            type="file"
                            id="fileInput"
                            accept=".log, .txt"
                            onChange={handleFileChange}
                        />
                        {selectedFile &&
                            <span className={styles.selectedFileLabel}>{selectedFile.name}</span>}
                        <div className={styles.dropAnywhere} onClick={(e) => {
                            document.getElementById("logsArea").scrollIntoView({block:'center', behavior:'smooth'})
                        }}>Drop file in text area</div>
                    </div>
                </Container>
                <Container>
                    <h2><span className={styles.icon}><AiOutlineAlignLeft/></span> Paste your logs below</h2>
                    <div className={styles.textAreaCtn}>
                        <textarea name="logs" id={"logsArea"} cols="30" rows="10" placeholder={"Paste your" +
                            " logs here or drop file"} className={styles.logsArea} onBlur={(e) => {
                            //document.getElementById("pro_btn").style.display = 'inherit'
                            analyze(document.getElementById("logsArea").value)
                        }} spellCheck={false} autoComplete={"off"}/>
                    </div>
                </Container>
                {lineCount !== 1 &&
                    <Container>
                        <h2><span className={styles.icon}><FaServer/></span> Server Information</h2>
                        <div className={styles.serverInfo}>
                            <ul>
                                <li>Server Version: <span className={styles.highlight}> {serverVersion}</span></li>
                                <li>Server Type: <span
                                    className={styles.highlight}> {serverLongVersion.replace("on", "")}</span></li>
                                <li>Errors: <span style={{color: "red"}}> {errorCount}</span></li>
                                <li>Lines: <span style={{color: "orange"}}> {lineCount}</span></li>
                            </ul>
                        </div>
                    </Container>
                }
                {errorCount > 0 &&
                    <Container>
                        <h2><span className={styles.icon}><AiFillWarning/></span> Server Errors</h2>
                        <div className={styles.errors}>
                            {errorConstruction}
                        </div>
                    </Container>
                }
                <Container>
                    <h2><span
                        className={styles.icon}><AiFillWarning/></span> {serverInfo.version} {serverInfo.longVer} Minecraft
                        Server</h2>
                    {lineCount === 1 && <div className={styles.basic}>Analyzed logs will appear here</div>}
                    <div>
                        <Results logs={logs} id={"jeff"}
                                 onResultsData={({errors, lines, version, longVer, errConstruction}) => {
                                     setErrorCount(errors)
                                     setLineCount(lines)
                                     setServerVersion(version)
                                     setServerLongVersion(longVer)
                                     setErrorConstruction(errConstruction)
                                 }}/>
                    </div>
                </Container>
            </div>
        </>

    )

}

function Results(props) {
    const text = props.logs.props.children
    const split = text.split("\n");
    let er = 0;
    let i = 0;
    if (text === "text") return
    for (let s in split) {
        const t = split[s]
        let time = ""
        const array = t.match(new RegExp("(?<time>^[[]\\d\\d:\\d\\d:\\d\\d])(?<text>.+)", "gm"))
        if (!array && document.getElementById("line_" + (parseInt(s) + 1)) === null) {
            construction.push(<Result key={randomInt(0, 999999999999)} line={parseInt(s) + 1} text={time} type={"INFO"}
                                      time={time}>{t}</Result>)
        }
        for (let a in array) {
            time = array[a].match(new RegExp("[[]\\d\\d:\\d\\d:\\d\\d]"))[0]
            let content = array[a].replace(time, "")
            const r = content.match(new RegExp("[[](?<type>.*?)\\/(?<infoType>\\w+)]"))
            let type = "INFO"
            if (r != null) {
                if (r.groups != null) {
                    if (r.groups.infoType != null) type = r.groups.infoType
                }
            }
            let things = {
                "ModernPluginLoadingStrategy": "An error is occurring with the plugin mentioned above. Either try to fix it or switch to another plugin",
                "Could not pass event": "This means an event in the plugin above is not being registered properly. The plugin might unload due to this. Hence, you won't be able to use it. To resolve this issue, install a more up to date version of the plugin or one that doesn't have the same issue.",
            }
            let reason = "No suggested fixes";
            if (content.includes("Starting minecraft server version")) {
                serverInfo.version = content.match("Starting minecraft server version (.+)")[1]
            }
            if (content.includes("This server is running")) {
                serverInfo.longVer = content.match("This server is running (.+)")[1]
                //document.getElementById("longVersion").innerText = longVer;
            }
            let regex = /(\w+|\d+|\D)([[]\/\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}:\d{0,7}])/gm
            content = content.replace(regex, "REDACTED IP")
            if (type === "ERROR") {
                er++
                for (const h in things) {
                    if (content.includes(h)) reason = things[h]
                }
            }
            if (document.getElementById("line_" + (parseInt(s) + 1)) !== null) continue
            else {
                construction.push(<Result key={randomInt(0, 999999999999)} line={parseInt(s) + 1} text={time}
                                          type={type.replace("FATAL", "ERROR").replace("DEBUG", "INFO").replace("TRACE", "TRACE")}
                                          time={time} reason={reason}>{content}</Result>)
                if (type.toLowerCase().replace("FATAL", "error") === "error") {
                    errConstruction.push(<Result key={randomInt(0, 999999999999)} line={parseInt(s) + 1} text={time}
                                                 type={type.replace("FATAL", "ERROR")} err={true} time={time}
                                                 reason={reason}>{content}</Result>)
                }
            }
        }
        i = s
    }
    serverInfo.lines = (parseInt(i) + 1)
    serverInfo.errors = er
    props.onResultsData({
        errors: er,
        lines: parseInt(i) + 1,
        version: serverInfo.version,
        longVer: serverInfo.longVer,
        errConstruction: errConstruction
    });
    if (text !== "text") {
        document.title = "" + serverInfo.version + " " + serverInfo.longVer + " Minecraft Server - MHLOGS"
    }
    if (serverInfo.lines === 1) return;
    return (
        <div className={styles.construction}>{construction}</div>
    )
}

function Result(props) {
    return (
        <div className={styles.line} data-type={props.type} id={"line_" + props.line + (props.err ? "_err" : "")}>
            <p className={styles.num}>{props.line}</p>
            {props.err ?
                <button onClick={(e) => {
                    document.getElementById("line_" + props.line).scrollIntoView({block: "center", behavior: "smooth"});
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

export default LogsArea