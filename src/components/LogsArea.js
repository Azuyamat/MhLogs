import styles from "@/styles/LogsArea.module.css"
import React, {useEffect, useState} from 'react';
import {randomInt} from "next/dist/shared/lib/bloom-filter/utils";
import {AiFillWarning, AiFillInfoCircle, AiOutlineAlignLeft} from "react-icons/ai";
import {FaServer} from "react-icons/fa";

let construction = [];
let serverVersion = 0;
let longVer = "";

function LogsArea(props){

    const notDefined = "Not defined"
    const [logs, setLogs] = useState(<div>text</div>)
    const [version, setVersion] = useState(0)
    const [errors, setErrors] = useState(0)
    const [lines, setLines] = useState(0)

    function analyze(text){
        construction = [];
        setLogs(<div>{text}</div>)
        console.log("Analyzed")
    }

    return (
        <>
            <div className={styles.wrapper} id={"wrapper"}>
                    <h1 className={styles.title}>MHLOGS</h1>
                    <textarea name="logs" id={"logsArea"} cols="30" rows="10" placeholder={"Paste your" +
                        " logs here"} className={styles.logsArea} onKeyDown={(e) => {
                        if (e.key === 'Enter'){
                            e.preventDefault()
                            analyze(e.target.value)
                        }
                    }} onPaste={(e) => {
                        setTimeout(function(){
                            analyze(e.target.value)
                        }, 100)
                    }} spellCheck={false}/>
            </div>
            <div className={styles.ctn}>
                <div className={styles.serverInfo}>
                    <ul>
                        <li><span className={styles.icon} style={{color:"#4bff89"}}><FaServer/></span> Server Version: <span className={styles.highlight} id={"version"}>{version}</span></li>
                        <li><span className={styles.icon} style={{color:"#4bff89"}}><FaServer/></span> Server Type: <span className={styles.highlight} id={"longVersion"}>Loading...</span></li>
                        <li><span className={styles.icon} style={{color:"red"}}><AiFillWarning/></span> Errors: <span className={styles.highlight} id={"errors"} style={{color:"red"}}> {errors}</span></li>
                        <li><span className={styles.icon} style={{color:"orange"}}><AiOutlineAlignLeft/></span> Lines: <span className={styles.highlight} id={"lines"} style={{color:"orange"}}> {lines}</span></li>
                        <li><span className={styles.icon} style={{color:"#3289a8"}}><AiFillInfoCircle/></span> Website it still in <span className={styles.highlight} id={"errors"}>beta</span></li>
                        <li><span className={styles.icon} style={{color:"#3289a8"}}><AiFillInfoCircle/></span> Made by <span className={styles.highlight} style={{textDecoration:'underline'}}><a
                            href="https://azuyamat.com">Azuyamat</a></span></li>
                    </ul>
                </div>
                <Results logs={logs} id={randomInt(0, 999999)}/>
            </div>
        </>

    )

    function Results(props){
        const text = props.logs.props.children
        const split = text.split("\n");
        setLines((parseInt(split.length)))
        let er = 0;
        for (let s in split){
            const t = split[s]
            const array = t.match(new RegExp("(?<time>^[[]\\d\\d:\\d\\d:\\d\\d])(?<text>.+)", "gm"))
            for (let a in array){
                let time = array[a].match(new RegExp("[[]\\d\\d:\\d\\d:\\d\\d]"))[0]
                let content = array[a].replace(time, "")
                const r = content.match(new RegExp("[[](?<type>ServerMain|Server thread)\\/(?<infoType>\\w+)]"))
                let type = "INFO"
                if (r != null){
                    if (r.groups != null){
                        if (r.groups.infoType != null) type = r.groups.infoType
                    }
                }
                let reason = "No suggested fixes";
                if (content.includes("Starting minecraft server version")){
                    serverVersion = content.match("Starting minecraft server version (.+)")[1]
                    setVersion(serverVersion)
                }
                if (content.includes("This server is running")){
                    longVer = content.match("This server is running (.+)")[1]
                    document.getElementById("longVersion").innerText = longVer;
                }
                let regex = /(\w+|\d+|\D)([[]\/\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}:\d{0,7}])/gm
                content = content.replace(regex, "REDACTED IP")
                let things = {
                    "ModernPluginLoadingStrategy": "An error is occurring with the plugin mentioned above. Either try to fix it or switch to another plugin",
                    "Could not pass event": "This means an event in the plugin above is not being registered properly. The plugin might unload due to this. Hence, you won't be able to use it. To resolve this issue, install a more up to date version of the plugin or one that doesn't have the same issue."
                }
                if (type === "ERROR"){
                    er++
                    for (const h in things){
                        if (content.includes(h)) reason = things[h]
                    }
                }
                construction.push(<Result key={randomInt(0, 999999999999)} line={parseInt(s)+1} type={type} time={time} reason={reason}>{content}</Result>)
            }
        }
        setErrors(er)
        return(
            <div id={"construction"}>{construction}</div>
        )
    }

    function Result(props){
        return (
            <div className={styles.line} data-type={props.type}>
                <p>{props.line}</p>
                <div>
                    <span className={styles.num}>{props.children}</span>
                    {props.type === "ERROR" ? <div className={styles.moreInfo}>{props.reason}</div> : ""}
                </div>
            </div>
        )
    }
}


export default LogsArea