import styles from "@/styles/Container.module.css"

function Container(props){

    return(
        <div className={styles.ctn}>
            {props.children}
        </div>
    )
}

export default Container