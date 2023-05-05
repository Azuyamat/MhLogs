import styles from "@/styles/LogsArea.module.css"
import React, {useEffect, useState} from 'react';
import {randomInt} from "next/dist/shared/lib/bloom-filter/utils";
import {AiFillWarning, AiFillInfoCircle} from "react-icons/ai";
import {FaServer} from "react-icons/fa";

let construction = [];
let serverVersion = 0;
let longVer = "";

function LogsArea(props){

    const notDefined = "Not defined"
    const [logs, setLogs] = useState(<div>text</div>)
    const [version, setVersion] = useState(0)
    const [errors, setErrors] = useState(0)

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
                        <li><span className={styles.icon} style={{color:"#4bff89"}}><FaServer/></span> Server Type: <span className={styles.highlight} id={"longVersion"}>{version}</span></li>
                        <li><span className={styles.icon} style={{color:"red"}}><AiFillWarning/></span> Errors: <span className={styles.highlight} id={"errors"} style={{color:"red"}}> {errors}</span></li>
                        <li><span className={styles.icon} style={{color:"#4bff89"}}><AiFillInfoCircle/></span> Website it still in <span className={styles.highlight} id={"errors"}>beta</span></li>
                        <li><span className={styles.icon} style={{color:"#4bff89"}}><AiFillInfoCircle/></span> Made by <span className={styles.highlight} style={{textDecoration:'underline'}}><a
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
                    document.getElementById("version").innerText = serverVersion
                }
                if (content.includes("This server is running")){
                    longVer = content.match("This server is running (.+)")[1]
                    document.getElementById("longVersion").innerText = longVer;
                }
                let regex = /(\w+|\d+|\D)([[]\/\d{0,3}.\d{0,3}.\d{0,3}.\d{0,3}:\d{0,7}])/gm
                content = content.replace(regex, "REDACTED IP")
                if (type === "ERROR"){
                    er++
                    if (content.includes("Could not load plugin")){
                        reason = "An error is occurring with the plugin mentioned above. Either try to" +
                            " fix it or switch to another plugin"
                    }
                    if (content.includes("Ambiguous plugin name")){
                        reason = "Is it possible that you have the same plugin multiple times in the" +
                            " same folder?"
                    }
                    if (content.includes("Is it up to date?")){
                        reason = "Make sure that you have the correct version for the plugin or" +
                            " considering uninstalling it"
                    }
                }
                construction.push(<Result key={randomInt(0, 999999999999)} line={s} type={type} time={time} reason={reason}>{content}</Result>)
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
                {props.type === "ERROR" ? <span className={styles.icon} style={{color:"red"}}><AiFillWarning/></span> : ""}
                <p>{props.line}</p>
                <span>{props.children}</span>
                {props.type === "ERROR" ? <div className={styles.moreInfo}>{props.reason}</div> : ""}
            </div>
        )
    }
}


export default LogsArea