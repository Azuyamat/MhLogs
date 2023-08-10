import styles from "@/styles/LogsArea.module.css"
import React, {useEffect, useState} from 'react';
import {randomInt} from "next/dist/shared/lib/bloom-filter/utils";
import {AiFillWarning, AiOutlineAlignLeft, AiOutlineArrowDown} from "react-icons/ai";
import {FaCopy, FaPlay, FaServer, FaShare, FaTrash} from "react-icons/fa";
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

    const locked = props.locked ? props.locked : false
    const content = props.content ? props.content : ""

    console.log("Content: "+content)


    const [logs, setLogs] = useState(<div>text</div>)

    const [errorCount, setErrorCount] = useState(0)
    const [lineCount, setLineCount] = useState(1)
    const [serverVersion, setServerVersion] = useState(null)
    const [serverLongVersion, setServerLongVersion] = useState(null)
    const [errorConstruction, setErrorConstruction] = useState(<div>None yet</div>)
    const [selectedFile, setSelectedFile] = useState(null);
    const [pluginList, setPluginList] = useState([]);
    const [shareLink, setShareLink] = useState("");

    function analyze(text) {
        construction = [];
        errConstruction = [];
        resetAnalysis()
        setTimeout(() => {
            setLogs(<div>{text}</div>)
        }, 100)
        showToast("Analyzing log file")

        const regex = /\[Server thread\/INFO]: \[([^\]]+)] Loading server plugin (\S+)/g;
        const plugins = [];
        let matches;
        let lineNumber = 1;

        while ((matches = regex.exec(text)) !== null) {
            const plugin = {
                name: matches[2],
                line: lineNumber
            }
            plugins.push(plugin);
            lineNumber++
        }
        console.log(plugins)
        setPluginList(plugins)
    }

    function copyToClipboard(text){
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast("Copied text to clipboard")
            })
            .catch(error => {
                console.error('Copy failed:', error);
            });
    }

    function resetAnalysis() {
        setErrorCount(0)
        setLineCount(1)
        setServerVersion("")
        setServerLongVersion("")
        setErrorConstruction(<div>None yet</div>)
        setLogs(<div>text</div>)
        setPluginList([])
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
                analyze(text)
                document.getElementById("logsArea").value = text
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
                {!locked &&
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
                            {!selectedFile &&
                                <div className={styles.dropAnywhere} onClick={(e) => {
                                    document.getElementById("logsArea").scrollIntoView({block:'center', behavior:'smooth'})
                                }}>Drop file in text area</div>}
                        </div>
                    </Container>}
                <Container id={"logsA"}>
                    {locked ? <h2><span className={styles.icon}><AiOutlineAlignLeft/></span> Logs</h2> : <h2><span className={styles.icon}><AiOutlineAlignLeft/></span> Paste your logs below</h2>}
                    <div className={styles.textAreaCtn}>
                        <textarea name="logs" id={"logsArea"} cols="30" rows="10" placeholder={"Paste your" +
                            " logs here or drop file"} className={styles.logsArea} onBlur={(e) => {
                            //document.getElementById("pro_btn").style.display = 'inherit'
                            analyze(document.getElementById("logsArea").value)
                        }} spellCheck={false} autoComplete={"off"} defaultValue={content} disabled={locked}/>
                    </div>
                </Container>
                <ul className={styles.list}>
                    <li><button onClick={(e) => {
                        analyze(content === "" ? document.getElementById("logsArea").value : content)
                    }} className={styles.share} data-color="green">Analyze logs <span><FaPlay/></span></button></li>
                    {(!locked && lineCount > 1) &&
                        <li><button className={styles.share} onClick={async (e) => {
                            if (e.target.innerText === "Link created"){
                                showToast("Link is already created")
                                return;
                            }
                            showToast("Creating share link")
                            try {
                                const response = await fetch('/api/logs', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ content: logs.props.children }), // Adjust as needed
                                });

                                console.log(response)
                                const responseData = await response.json();

                                console.log(responseData)

                                if (response.ok) {
                                    e.target.innerText = "Link created"
                                    setShareLink("https://mhlogs.com/log/"+responseData.timestamp)
                                } else {
                                    console.log("Error")
                                }
                            } catch (error) {
                                console.error('Error:', error);
                                document.getElementById('response').textContent = 'An error occurred.';
                            }
                        }}>Share Logs <span><FaShare/></span></button></li>}
                    {(lineCount !== 1 && !locked) &&
                    <li>
                        <button className={styles.share} data-color={'red'} onClick={() => {
                            resetAnalysis()
                        }}>Erase <span><FaTrash/></span></button>
                    </li>
                    }
                    {(shareLink !== "") &&
                    <li>
                        <a href={shareLink} className={styles.share}>Click here to view share link</a>
                    </li>}
                    {(shareLink !== "") &&
                        <li>
                            <button className={styles.share} onClick={() => {
                                copyToClipboard(shareLink)
                            }}>Copy share link<span><FaCopy/></span></button>
                        </li>}
                </ul>
                {lineCount !== 1 &&
                    <Container>
                        <h2><span className={styles.icon}><FaServer/></span> Server Information</h2>
                        <div className={styles.serverInfo}>
                            <ul>
                                <li>Server Version: <span className={styles.highlight}> {serverVersion}</span></li>
                                <li>Server Type: <span
                                    className={styles.highlight}> {serverLongVersion}</span></li>
                                <li>Errors: <span style={{color: "red"}}> {errorCount}</span></li>
                                <li>Lines: <span style={{color: "orange"}}> {lineCount}</span></li>
                                {pluginList.length > 0 &&
                                    <li>Plugins ({pluginList.length}):</li>
                                }
                                <ul className={styles.plugins}>
                                    {pluginList.sort().map((plugin, index) => (
                                        <li key={index}>{plugin.name}</li>
                                    ))}
                                </ul>
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
                    <h2>
                        <span className={styles.icon}><AiFillWarning/></span>
                        {serverInfo.version} {serverInfo.longVer} Minecraft Server
                    </h2>
                    {lineCount === 1 && <div className={styles.basic}>Analyzed logs will appear here</div>}
                    <div>
                        <Results logs={logs} id={"jeff"}
                                 onResultsData={({errors, lines, version, longVer, errConstruction}) => {
                                     setErrorCount(errors)
                                     setLineCount(lines)
                                     setServerVersion(version)
                                     setServerLongVersion(longVer)
                                     setErrorConstruction(errConstruction)
                                     showToast("Logs analyzed")
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
        try{
            if (!array && document.getElementById("line_" + (parseInt(s) + 1)) === null) {
                construction.push(<Result key={randomInt(0, 999999999999)} line={parseInt(s) + 1} text={time} type={"INFO"}
                                          time={time}>{t}</Result>)
            }
        } catch (e){
            continue
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
            try{
                if (document.getElementById("line_" + (parseInt(s) + 1)) !== null) continue;
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
            catch(e){
                return e;
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
    try{
        if (text !== "text") {
            document.title = "" + serverInfo.version + " " + serverInfo.longVer + " Minecraft Server - MHLOGS"
        }
    }catch(e){}
    if (serverInfo.lines === 1) return;
    const ce = construction.map((result, _) => {
        if (React.isValidElement(result)) {
            return result;
        }
        return null;
    });
    return (
        <div className={styles.construction}>{ce}</div>
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