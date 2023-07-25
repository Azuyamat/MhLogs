import styles from "@/styles/Container.module.css"

function Container(props){

    return(
        <div className={styles.ctn} id={props.id ? props.id :""}>
            {props.children}
        </div>
    )
}

export default Container