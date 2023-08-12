import styles from "@/styles/components/Policy.module.css";

export default function Policy() {
    return (
        <>
            <main>
                <div className={styles.wrapper}>
                    <div className={styles.desc}>
                        Privacy Policy for MHLOGS:
                        <br />
                        Effective Date: 07/24/2023
                        <br />
                        This Privacy Policy explains how MHLogs ({`"`}we{`"`}, {`"`}our{`"`}, or {`"`}us{`"`}) collects, uses, and processes data when you use our website to analyze and share log files, and to generate analyzed log files with filtered out errors. We are committed to protecting your privacy and ensuring that any personal information you provide to us remains secure.

                    </div>
                    <div className={styles.policyArea}>
                        <ul>
                            <li>
                                <h1><span className={styles.num}>1</span> Information We Collect:</h1>
                                <p>When you use our website to analyze log files, we may collect personal information from you, including but not limited to your username, email address, and uploaded log files. This information is used to provide you with access to our services, analyze logs, and facilitate sharing with other users.</p>
                            </li>
                            <li>
                                <h1><span className={styles.num}>2</span> Use of Log Files:</h1>
                                <p>The log files you upload to our website are used for the purpose of analysis and generating analyzed log files with filtered out errors. Additionally, users can now share logs with other users, and those logs may be accessible to the recipients you share them with.</p>
                            </li>
                            <li>
                                <h1><span className={styles.num}>3</span> Cookies:</h1>
                                <p>We may use cookies or similar tracking technologies to enhance your experience on our website. These technologies may collect information about your browsing behavior and activities on our website.</p>
                            </li>
                            <li>
                                <h1><span className={styles.num}>4</span> Data Security:</h1>
                                <p>We take data security seriously and have implemented reasonable technical and organizational measures to safeguard the information you provide to us. However, no data transmission over the internet or electronic storage method is entirely secure. While we strive to protect your data, we cannot guarantee its absolute security.</p>
                            </li>
                            <li>
                                <h1><span className={styles.num}>5</span> Third-Party Services:</h1>
                                <p>We may use third-party services or integrations to facilitate user authentication and sharing functionality. These services may have access to certain user information, as necessary for their respective functionalities.</p>
                            </li>
                            <li>
                                <h1><span className={styles.num}>6</span> Data Retention:</h1>
                                <p>We retain the log file data you upload and the associated user information as long as necessary to provide our services and comply with legal obligations. Your color preference information stored in local storage is retained as long as you continue to use our website.</p>
                            </li>
                            <li>
                                <h1><span className={styles.num}>7</span> Children{"'"}s Privacy:</h1>
                                <p>Our website is not intended for use by individuals under the age of 13. We do not knowingly collect any information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us, and we will promptly delete such information.</p>
                            </li>
                            <li>
                                <h1><span className={styles.num}>8</span> Changes to this Privacy Policy:</h1>
                                <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the effective date will be updated accordingly. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.</p>
                            </li>
                            <li>
                                <h1><span className={styles.num}>9</span> Storage of User Preferences:</h1>
                                <p>We offer the option for users to select their preferred color scheme to view the website. To facilitate this, we use local storage in your browser to store your color preference. This information is solely used to display the website with your chosen color scheme and is not transmitted to our servers.</p>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.desc}>
                        Contact Us: <br />
                        If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at discordazu@gmail.com.
                        <br /><br />
                        By using our website to analyze and share log files, you acknowledge that you have read and understood this Privacy Policy and agree to its terms. If you do not agree with this Privacy Policy, please refrain from using our website for log file analysis and sharing.
                        <br /><br />
                        Thank you for trusting us with your log file analysis and sharing needs.
                        <br /><br />
                        MHLOGS Team
                    </div>
                </div>
            </main>
        </>
    )
}
