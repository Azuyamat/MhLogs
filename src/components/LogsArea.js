//Author: Azuyamat
//Description: This file is the core of the website. Bringing the multiple information containers and input areas.


import styles from "@/styles/components/LogsArea.module.css"
import React, {useCallback, useEffect, useState} from 'react';
import {randomInt} from "next/dist/shared/lib/bloom-filter/utils";
import {AiFillWarning, AiOutlineAlignLeft, AiOutlineArrowDown} from "react-icons/ai";
import {FaCopy, FaPlay, FaServer, FaShare, FaTrash} from "react-icons/fa";
import {showToast} from "@/components/Toast";
import Arrow from "@/components/Arrow"
import Container from "@/components/Container";
import { useUser } from '@clerk/nextjs'
import Share from "@/components/Share";
import Loading from "@/components/Loading"

// Small disclaimer:
// The file is quite bulky and could probably be seperated a tad bit better within numerous other components. The reason it is all handled in one file (or a few more) is to guide its simplicity


let serverInfo =
    {
        "errors": 0,
        "lines": 0,
        "version": "",
        "longVer": ""
    }


function LogsArea(props) {

    const { isLoaded, isSignedIn, user } = useUser()


    const [logs, setLogs] = useState(props.content ? props.content : "")
    const [errorCount, setErrorCount] = useState(0)
    const [lineCount, setLineCount] = useState(1)
    const [serverVersion, setServerVersion] = useState(null)
    const [serverLongVersion, setServerLongVersion] = useState(null)
    const [errorConstruction, setErrorConstruction] = useState(<div>None yet</div>)
    const [selectedFile, setSelectedFile] = useState(null);
    const [pluginList, setPluginList] = useState([]);
    const [shareLink, setShareLink] = useState(null);
    const [shareShown, setShareShown] = useState(false);
    const [construction, setConstruction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const locked = props.locked ? props.locked : false
    let content = props.content ? props.content : logs
    const sharedBy = props.sharedBy




    const a = useCallback((text) => {
        setLoading(true)
        resetAnalysis(false)
        setTimeout(() => {
            analyze(text)
        }, 1)
    }, [])
    useEffect(() => {
        if (!loaded){
            setLoaded(true);
            a(content)
        }
    }, [a, content, loaded]);

    if (!isLoaded){
        return (
            <div>Not loaded.</div>
        )
    }


    //Analyze server logs or (see below) reset the analysis
    function analyze(text){
        const construction = [];
        const errConstruction = [];
        showToast("Analyzing log file")
        const regex = /\[Server thread\/INFO]: \[([^\]]+)] Loading server plugin (\S+)/g;
        const plugins = [];
        let matches;
        while ((matches = regex.exec(text)) !== null) {
            const plugin = {
                name: matches[2]
            }
            plugins.push(plugin);
        }
        setPluginList(plugins)

        let ip_regex = /(\w+|\d+|\D)([[]\/\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}:\d{0,7}])/gm
        const newText = text.replace(ip_regex, "REDACTED IP")
        const split = newText.split("\n");

        let er = 0; //Number of errors
        let i = 0; //Increment

        if (text === "text") return //Basically, if no logs are inputted yet (Default log text is "text")

        //Loop through every line of the log file
        for (let s in split) {
            const t = split[s] //Line content
            let time = ""
            const array = t.match(new RegExp("(?<time>^[[]\\d\\d:\\d\\d:\\d\\d])(?<text>.+)", "gm")) //Regex to match the time (Usual format: [08:50:00])

            //If the regex match is unsuccessful and the line doesn't already exist, it is appended to the output result
            try{
                if (!array && document.getElementById("line_" + (parseInt(s) + 1)) === null) {
                    construction.push(
                        <Result
                            key={randomInt(0, 999999999999)}
                            line={parseInt(s) + 1}
                            text={time}
                            type={"INFO"}
                            time={time}
                        >{t}</Result>
                    )
                }
            } catch (e){
                continue
            }


            for (let a in array) { //Loop all matches in regex array
                time = array[a].match(new RegExp("[[]\\d\\d:\\d\\d:\\d\\d]"))[0]

                let content = array[a].replace(time, "") //Content w/o time Ex: [ServerMain/INFO]: Building unoptimized
                const r = content.match(new RegExp("[[](?<type>.*?)\\/(?<infoType>\\w+)]")) //Regex to match [ServerMain/INFO]
                let type = "INFO" //Default type is INFO, other types include [ERROR, FATAL, WARN, INFO]
                if (r.groups.infoType != null) {
                    type = r.groups.infoType
                }

                //Possible server error fixes
                //TODO Add JSON file instead of using variable like this
                let things = {
                    "ModernPluginLoadingStrategy": "An error is occurring with the plugin mentioned above. Either try to fix it or switch to another plugin",
                    "Could not pass event": "This means an event in the plugin above is not being registered properly. The plugin might unload due to this. Hence, you won't be able to use it. To resolve this issue, install a more up to date version of the plugin or one that doesn't have the same issue.",
                }

                let reason = "No suggested fixes"; //Default reason

                //Catching server version
                if (content.includes("Starting minecraft server version")) {
                    serverInfo.version = content.match("Starting minecraft server version (.+)")[1]
                }

                //Catching long server version
                if (content.includes("This server is running")) {
                    serverInfo.longVer = content.match("This server is running (.+)")[1]
                    //document.getElementById("longVersion").innerText = longVer;
                }

                //Additional error management
                if (type === "ERROR") {
                    er++
                    for (const h in things) {
                        if (content.includes(h)) reason = things[h]
                    }
                }

                //Appending line to output result
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
        //Validate construction
        const ce = construction.map((result, _) => {
            if (React.isValidElement(result)) {
                return result;
            }
            return null;
        });

        setLogs(newText)
        setErrorCount(er)
        setLineCount(parseInt(i) + 1)
        setServerVersion(serverInfo.version)
        setServerLongVersion(serverInfo.longVer)
        setErrorConstruction(errConstruction)
        setConstruction(ce)
        showToast("Analyzed server logs")
        setLoading(false)

        //Changing document title
        try{
            if (text !== "text") {
                document.title = "" + serverInfo.version + " " + serverInfo.longVer + " Minecraft Server - MHLOGS"
            }
        }catch(e){}
        if (serverInfo.lines === 1) return; //Return if no log was inputted
    }

    function resetAnalysis(withTextArea = false) {
        setErrorCount(0)
        setLineCount(1)
        setServerVersion("")
        setServerLongVersion("")
        setErrorConstruction(<div>None yet</div>)
        setLogs("")
        setPluginList([])
        setShareLink("")
        setConstruction(null)
        if (withTextArea) document.getElementById("logsArea").value = ""
    }


    //File drop/upload handlers
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
                a(text)
                document.getElementById("logsArea").value = text
            };
            reader.readAsText(file);
            setSelectedFile(file)
        }
    }

    //LogArea rendered output
    return (
        <>
            <Arrow/>
            <Loading loading={loading}/>
            {shareShown &&
                <Share
                    logs={logs}
                    onClose={() => setShareShown(false)}
                    createShareLink={(link) => setShareLink(link)}
                />}

            <div className={styles.wrapper} id={"wrapper"} onDrop={handleDrop}>

                {/*Context buttons list*/}
                <ul className={styles.list}>
                    {(!locked && lineCount > 1 && shareLink.length < 1) &&
                        <li><button className={styles.share} onClick={() => {
                            setShareShown(true)
                            console.log(shareShown)
                        }}><p>Share Logs </p><span><FaShare/></span></button></li>}
                    {(lineCount !== 1 && !locked) &&
                        <li>
                            <button className={styles.share} data-color={'red'} onClick={() => {
                                resetAnalysis(true)
                            }}><p>Reset </p><span><FaTrash/></span></button>
                        </li>
                    }
                    {(shareLink.length > 1) &&
                        <li>
                            <a href={shareLink} className={styles.share}><p>Click here to view share link</p></a>
                        </li>}
                    {(shareLink.length > 1) &&
                        <li>
                            <button className={styles.share} onClick={() => {
                                copyToClipboard(shareLink)
                            }}><p>Copy share link </p><span><FaCopy/></span></button>
                        </li>}
                    {(user?.id === props.userId && user?.id !== undefined) &&
                        <li>
                            <button
                                className={styles.share}
                                data-color={'red'}
                                onClick={async () => {
                                    try {
                                        console.log("Timestamp: "+props.timestamp)
                                        const response = await fetch(`/api/logs?timestamp=${props.timestamp}`, {
                                            method: 'DELETE',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            }
                                        });

                                        if (response.ok) {
                                            console.log('Log deleted successfully');
                                            resetAnalysis(true)
                                        } else {
                                            console.error('Error deleting log:', response.statusText);
                                        }
                                    } catch (error) {
                                        console.error('Error deleting log:', error);
                                    }
                                }}
                            >
                                <p>Delete share </p><span><FaTrash/></span>
                            </button>
                        </li>
                    }
                </ul>

                {/*Shared by area*/}
                {locked &&
                    <Container>
                        <h2><span className={styles.icon}><AiOutlineAlignLeft/></span> These logs have been shared</h2>
                        <div className={styles.serverInfo}>
                            <ul>
                                <li>Shared by: <span className={styles.highlight}>@{sharedBy} ({props.userId})</span></li>
                            </ul>
                        </div>
                    </Container>
                }

                {!locked &&
                    <Container>
                        <h2><span className={styles.icon}><AiOutlineAlignLeft/></span> Upload, copy or drop a .txt or .log file</h2>
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
                                <div className={styles.dropAnywhere} onClick={() => {
                                    document.getElementById("logsArea").scrollIntoView({block:'center', behavior:'smooth'})
                                }}>Drop file in text area below</div>}
                        </div>
                        <textarea name="logs" id={"logsArea"} cols="30" rows="10" placeholder={"Paste your" +
                            " logs here or drop file"} className={styles.logsArea} onBlur={() => {
                            //document.getElementById("pro_btn").style.display = 'inherit'
                            a(document.getElementById("logsArea").value)
                        }} onPaste={() => {
                            a(document.getElementById("logsArea").value)
                        }} spellCheck={false} autoComplete={"off"} defaultValue={content} disabled={locked}/>
                    </Container>}

                {/*Server information container*/}
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

                {/*Server errors*/}
                {errorCount > 0 &&
                    <Container>
                        <h2><span className={styles.icon}><AiFillWarning/></span> Server Errors</h2>
                        <div className={styles.errors}>
                            {errorConstruction}
                        </div>
                    </Container>
                }

                {/*Output logs*/}
                {construction !== null && <Container>
                    <h2>
                        <span className={styles.icon}><AiFillWarning/></span>
                        {serverInfo.version} {serverInfo.longVer} Minecraft Server
                    </h2>
                    <div>
                        <Results construction={construction}/>
                    </div>
                </Container>}
            </div>
        </>

    )

}

function Results(props) {
    return (
        <div className={styles.construction}>{props.construction}</div>
    )
}


//Line result component in output log area
function Result(props) {

    // Possible data types, {ERROR, WARN, INFO} [FATAL] They will usually all be caught, no
    // matter what is the data type. (CSS may not be supported for all of them though

    return (
        <div className={styles.line} data-type={props.type} id={"line_" + props.line + (props.err ? "_err" : "")}>

            {/*Line number*/}
            <p className={styles.num}>{props.line}</p>

            {/*Possible fixes if an error + content of the line*/}
            {props.err ?
                <button onClick={() => {
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

//Copy to clipboard function
export function copyToClipboard(text){
    navigator.clipboard.writeText(text)
        .then(() => {
            showToast("Copied text to clipboard")
        })
        .catch(error => {
            console.error('Copy failed:', error);
        });
}

export default LogsArea
